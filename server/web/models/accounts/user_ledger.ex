defmodule Nimble.UserLedger do
  @moduledoc """
  Defines a UserLedger model to track a user's ledger.
  """
  use Nimble.Web, :model

  alias Hex.API.User
  alias Nimble.BillCharge
  alias Nimble.User
  alias Nimble.UserLedger

  schema "users_ledgers" do
    field(:balance, Money.Ecto.Composite.Type)

    belongs_to(:user, User)

    has_many(:charges, BillCharge)

    has_many(:created_bills, Nimble.Bill)
    has_many(:bills, through: [:charges, :bill])
    timestamps()
  end

  @doc """
  A user ledger changeset for registration.
  """
  def changeset(%UserLedger{} = user_ledger, attrs) do
    user_ledger
    |> cast(attrs, [:balance])
    |> validate_required([:balance])
  end
end
