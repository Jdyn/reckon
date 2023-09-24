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
    field(:approved, :boolean, default: false)

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
    |> validate_required([:amount, :user_id])
    |> unique_constraint(:member, name: :no_duplicate_charges, message: "Cannot be included twice.")
    |> foreign_key_constraint(:user_id)
  end

  @doc """
  Flips the approved field of a BillCharge.

    ## Example
      iex> bill_charge = %BillCharge{approved: false}
      iex> BillCharge.approval_changeset(bill_charge)
      Ecto.Changeset<
        action: nil,
        changes: %{approved: true},
        errors: [],
        data: #Nimble.BillCharge<>,
        valid?: true
      >
  """
  def approval_changeset(bill_charge) do
    approved = bill_charge.approved

    bill_charge
    |> cast(%{approved: not approved}, [:approved])
    |> validate_required([:approved])
  end
end
