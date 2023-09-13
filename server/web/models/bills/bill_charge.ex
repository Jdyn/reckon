defmodule Nimble.BillCharge do
  @moduledoc """
  Defines a BillCharge model to track a bill's charges.
  A BillCharge is a record of a users participation in a bill.
  It describes the amount of money a participant of the bill owes,
  and whether the participant has accepted and paid the charge.
  """
  use Nimble.Web, :model

  alias Nimble.Bill
  alias Nimble.Accounts.Users

  schema "bills_charges" do
    # The amount of money the chargee owes.
    field(:amount, Money.Ecto.Composite.Type)
    # The percentage of the Bill the chargee owes.
    field(:split_percent, :decimal)
    # Whether the chargee has accepted the charge.
    field(:accepted, :boolean, default: false)

    # the status of the charge payment
    # uncharged -> processing -> ( succeeded | requires_payment_method )
    field(:payment_status, :string, default: "uncharged")

    belongs_to(:bill, Bill)
    belongs_to(:user_ledger, Nimble.UserLedger, foreign_key: :user_ledger_id)
    has_one(:user, through: [:user_ledger, :user])
    timestamps()
  end

  def create_changeset(bill_charge, attrs \\ %{}) do
    bill_charge
    |> cast(attrs, [:amount, :split_percent, :user_ledger_id])
    |> validate_required([:amount, :split_percent, :user_ledger_id])
  end

  def put_ledger(charge) do
    user_ledger = Users.get_ledger(charge["user_id"]) || %{id: nil}
    Map.put(charge, "user_ledger_id", user_ledger.id)
  end

  def put_amount(%{ "split_percent" => split} = charge, total) do
    amount = Money.mult!(total, split)
    Map.put(charge, "amount", Money.round(amount))
  end

  # def build_ledger_ids(%{"charges" => charges} = attrs) do
  #   user_ids = Enum.map(charges, fn charge -> charge["user_id"] end)
  #   user_ledgers = Users.get_ledgers(user_ids)

  #   Map.put(
  #     attrs,
  #     "charges",
  #     Enum.map(charges, fn charge ->
  #       ledger_id = Enum.find(user_ledgers, %{id: nil}, fn l -> l.user_id == charge["user_id"] end).id

  #       %{
  #         "`split_percent" => charge["split_percent"],
  #         "user_ledger_id" => ledger_id
  #       }
  #     end)
  #   )
  # end
end
