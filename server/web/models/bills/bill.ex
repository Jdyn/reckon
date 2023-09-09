defmodule Nimble.Bill do
  @moduledoc false
  use Nimble.Web, :model

  alias Nimble.BillCharge
  alias Nimble.BillItem

  @statuses ~w(pending ready processing requires_action paid)a
  @split_types ~w(even custom)a

  schema "bills" do
    field(:description, :string)
    field(:total, Money.Ecto.Composite.Type)

    # The type of split to use for the bill, either even or custom
    field(:split, :string, default: "evenly")

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

    belongs_to(:user_ledger, Nimble.UserLedger)
    has_one(:creator, through: [:user_ledger, :user])

    timestamps()
  end
end
