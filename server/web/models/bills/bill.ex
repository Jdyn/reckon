defmodule Nimble.Bill do
  @moduledoc false
  use Nimble.Web, :model

  alias Nimble.BillCharge
  alias Nimble.BillItem
  alias Nimble.UserLike

  # @statuses ~w(pending ready processing requires_action paid)a

  schema "bills" do
    field(:description, :string)

    # The type of split
    # split: Evenly split the bill between all members
    # pool: every member pays a fixed amount
    # custom: each member pays a custom amount based on the charge split_percent
    field(:type, :string, default: "split")

    field(:total, Money.Ecto.Composite.Type, default_currency: :USD)

    # The status of the bill
    # draft: Bill items and charges are not finalized
    # pending: Waiting for all members to accept the bill
    # ready: The bill is ready to be submitted, only used if `requires_confirmation` is true
    # processing: The bill has been submitted and is beginning payment processing
    # requires_action: A billing failures has occrued on one or more chargee
    #   In this case, all successful charges will go through, and a mark will be placed on the failed charges.
    #   Allowing the chargee to update their payment information and try again.
    # paid: The bill has been paid by all and is complete
    field(:status, :string, default: "pending")

    has_many(:items, BillItem)
    has_many(:charges, BillCharge)
    has_many(:members, through: [:charges, :user])

    # We sychronize the likes count with the likes table to avoid having to query the table
    has_many(:likes, UserLike)
    field(:like_count, :integer, default: 0)
    field(:liked, :boolean, virtual: true)

    embeds_one(:options, BillOptions, primary_key: false) do
      # whether the bill requires confirmation BY the creator before the bill is submited
      field(:requires_confirmation, :boolean, default: false)
      # The date of when the bill will become interactable by the chargees
      field(:start_date, :utc_datetime, default: nil)
      # The date of when the bill will be due
      field(:due_date, :utc_datetime, default: nil)
    end

    belongs_to(:group, Nimble.Group)
    belongs_to(:creator, Nimble.User)
    belongs_to(:category, Nimble.BillCategory, foreign_key: :category_id)

    timestamps()
  end

  def create_changeset(bill, attrs \\ %{}) do
    bill
    |> cast(attrs, [:description, :total, :status, :group_id, :creator_id, :category_id])
    |> validate_required([:description, :total, :group_id, :creator_id])
    |> validate_inclusion(:type, ["split", "fixed", "custom"])
    |> cast_embed(:options, required: true, with: &options_changeset/2)
    |> build_even_split()
    |> cast_assoc(:items, required: false, with: &BillItem.create_changeset/2)
    |> cast_assoc(:charges, required: true, with: &BillCharge.create_changeset/2)
    |> cross_validate_total(:items, :cost)
    |> cross_validate_total(:charges, :amount)
  end

  def options_changeset(bill_options, attrs \\ %{}) do
    cast(bill_options, attrs, [:requires_confirmation, :start_date, :due_date])
  end

  def build_even_split(changeset) do
    total = get_change(changeset, :total)

    with {:ok, charges} <- Map.fetch(changeset.params, "charges") do
      {amount, remainder} = Money.split(total, Enum.count(charges))

      [first | rest] = Enum.reduce(charges, [], &[Map.put(&1, "amount", amount) | &2])
      charges = [%{first | "amount" => Money.add!(first["amount"], remainder)} | rest]

      Map.put(changeset, :params, %{changeset.params | "charges" => charges})
    else
      :error ->
        add_error(changeset, :charges, "Must specify atleast one member of the bill.")
    end
  end

  @doc """
  Cross validates that the total of the bill is equal to the total of the items or charges.
  Otherwise, it will add an error to the changeset.
  """
  def cross_validate_total(changeset, key, field) do
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

  @doc """
  Checks whether the sum of the `changes` in the `Money` :field of the `changesets` is equal to the `total`.

  Returns a tuple of the comparison result :eq | :lt | :gt and the sum of the `changes`.

    ## Example
      iex> valid_costs?(Money.new(:USD, "30"), [
        #Ecto.Changeset<changes: %{ cost: Money.new(:USD, "10") }>,
        #Ecto.Changeset<changes: %{ cost: Money.new(:USD, "20") }>
      ], :cost)
      {:eq, Money.new(:USD, "30")}
  """
  def valid_costs?(total, changesets, field) do
    item_total = sum_costs(changesets, field)
    {Money.compare!(item_total, total), item_total}
  end

  @doc """
    Takes in a list of Ecto.Changeset`s with `changes` in a `Money` :field and computes the sum of the :field.
    Returns the sum as a Money struct.

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
