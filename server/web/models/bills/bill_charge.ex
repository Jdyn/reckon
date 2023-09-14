defmodule Nimble.BillCharge do
  @moduledoc """
  Defines a BillCharge model to track a bill's charges.
  A BillCharge is a record of a users participation in a bill.
  It describes the amount of money a participant of the bill owes,
  and whether the participant has accepted and paid the charge.
  """
  use Nimble.Web, :model

  alias Nimble.Bill

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
    belongs_to(:user, Nimble.User)

    timestamps()
  end

  def create_changeset(bill_charge, attrs \\ %{}) do
    bill_charge
    |> cast(attrs, [:amount, :split_percent, :user_id])
    |> validate_required([:amount, :split_percent, :user_id])
  end

  def put_amount(%{"split_percent" => split} = charge, total) do
    amount = Money.mult!(total, split)
    Map.put(charge, "amount", Money.round(amount))
  end
end
