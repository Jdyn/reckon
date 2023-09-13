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

    # The type of split to use for the bill, either even or custom
    field(:split_type, :string, default: "evenly")

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
    |> cast(attrs, [:description, :total, :split_type, :status, :group_id, :creator_ledger_id])
    |> validate_required([:description, :total, :group_id, :creator_ledger_id])
    |> cast_embed(:options, required: true, with: &options_changeset/2)
    |> cast_assoc(:items, required: false, with: &BillItem.create_changeset/2)
    |> cast_assoc(:charges, required: false, with: &BillCharge.create_changeset/2)
    |> validate_item_total()

    # |> BillCharge.cast_charges(attrs)
  end

  def options_changeset(bill_options, attrs \\ %{}) do
    cast(bill_options, attrs, [:requires_confirmation, :start_date, :due_date])
  end

  @doc """
  Validates that the sum of the individual item costs matches the total cost of the bill.
  If not, an error is added to the changeset.
  """
  def validate_item_total(changeset) do
    total = get_change(changeset, :total)
    item_changesets = get_change(changeset, :items)

    case BillItem.valid_costs?(total, item_changesets) do
      :equal ->
        changeset

      comparor ->
        add_error(
          changeset,
          :total,
          "The cost of the items are #{Atom.to_string(comparor)} than the cost of the bill."
        )
    end
  end
end
