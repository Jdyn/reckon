defmodule Nimble.Bill do
  @moduledoc false
  use Nimble.Web, :model

  alias Nimble.BillCharge
  alias Nimble.BillItem

  @statuses ~w(pending ready processing requires_action paid)a
  @split_types ~w(even custom)a

  schema "bills" do
    field(:description, :string)
    field(:total, Money.Ecto.Composite.Type, default_currency: :USD)

    # The status of the bill
    # pending: Waiting for all members to accept the bill
    # ready: The bill is ready to be submitted, only used if `requires_confirmation` is true
    # processing: The bill has been submitted and is beginning payment processing
    # requires_action: A billing failures has occrued on one or more chargee
    #   In this case, all successful charges will go through, and a mark will be placed on the failed charges.
    #   Allowing the chargee to update their payment information and try again.
    # paid: The bill has been paid by all and is complete
    field(:status, :string)

    has_many(:items, BillItem)
    has_many(:charges, BillCharge)
    has_many(:contributors, through: [:charges, :user])

    embeds_one(:options, BillOptions, primary_key: false) do
      # whether the bill requires confirmation BY the creator before the bill is submited
      field(:requires_confirmation, :boolean, default: false)
      # The date of when the bill will become interactable by the chargees
      field(:start_date, :utc_datetime, default: nil)
      # The date of when the bill will be due
      field(:due_date, :utc_datetime, default: nil)
    end

    belongs_to(:group, Nimble.Group)

    belongs_to(:creator_ledger, Nimble.UserLedger)
    has_one(:creator, through: [:creator_ledger, :user])

    timestamps()
  end

  def create_changeset(bill, attrs \\ %{}) do
    bill
    |> cast(attrs, [:description, :total, :status, :group_id, :creator_ledger_id])
    |> validate_required([:description, :total, :group_id, :creator_ledger_id])
    |> cast_embed(:options, required: true, with: &options_changeset/2)
    |> cast_assoc(:items, required: false, with: &BillItem.create_changeset/2)
    |> cast_charges()
    |> validate_total(:items, :cost)
  end

  def options_changeset(bill_options, attrs \\ %{}) do
    cast(bill_options, attrs, [:requires_confirmation, :start_date, :due_date])
  end

  defp cast_charges(changeset) do
    total = get_change(changeset, :total)

    with {:ok, charges} <- Map.fetch(changeset.params, "charges") do
      charges =
        Enum.reduce(charges, [], fn charge, acc ->
          charge =
            charge
            |> BillCharge.put_amount(total)
            |> BillCharge.put_ledger()

          [charge | acc]
        end)

      changeset
      |> Map.put(:params, %{changeset.params | "charges" => charges})
      |> cast_assoc(:charges, required: true, with: &BillCharge.create_changeset/2)
      |> validate_split()
      |> validate_total(:charges, :amount)
    else
      :error ->
        add_error(changeset, :charges, "Must specify atleast one charge.")
    end
  end

  @doc """
  This function computes the remainder of the total cost of the bill and adds it to the first charge.
  This covers the case where the total cost of the bill is not evenly divisible by the number of charges.
  """
  def validate_split(changeset) do
    charges = get_change(changeset, :charges)
    charge_total = sum_costs(charges, :amount)
    total = get_change(changeset, :total)

    remainder = total |> Money.sub!(charge_total) |> Money.round()
    charge = List.first(charges, %BillCharge{})
    charge_changeset = BillCharge.create_changeset(charge, %{amount: Money.add!(get_change(charge, :amount), remainder)})
    put_change(changeset, :charges, List.replace_at(charges, 0, charge_changeset))
  end

  @doc """
  Validates that the sum of the individual item costs matches the total cost of the bill.
  If not, an error is added to the changeset.
  """
  def validate_total(changeset, key, field) do
    total = get_change(changeset, :total)
    changesets = get_change(changeset, key)

    case valid_costs?(total, changesets, field) do
      {:eq, _} ->
        changeset

      {cmp, item_total} ->
        add_error(
          changeset,
          key,
          "The #{key} are #{item_total}, which is #{if cmp == :gt, do: "greater", else: "less"} than the #{Money.to_string!(total)} total."
        )
    end
  end

  defp valid_costs?(total, changesets, field) do
    item_total = sum_costs(changesets, field)
    dbg(total)
    dbg(item_total)
    {Money.compare!(item_total, total), item_total}
  end

  @doc """
    Takes in a list of BillItem `Ecto.Changeset`s and sums the cost within the 'changes' field
    of each changeset. Returns the sum as a Money struct.

    ## Example
      iex> sum_costs([
        #Ecto.Changeset<changes: %{ cost: Money.new(:USD, "10") }>,
        #Ecto.Changeset<changes: %{ cost: Money.new(:USD, "20") }>
      ])
      Money.new(:USD, "30")
  """
  def sum_costs(changesets, field) do
    Enum.reduce(changesets, Money.zero(:USD), fn item_changeset, acc ->
      with money = %Money{} <- get_change(item_changeset, field) do
        Money.add!(acc, money)
      else
        _ -> acc
      end
    end)
  end
end
