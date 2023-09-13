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
    field(:balance, Money.Ecto.Composite.Type, default_currency: :USD, default: Money.new(:USD, 0))

    belongs_to(:user, User)

    has_many(:charges, BillCharge)

    has_many(:created_bills, Nimble.Bill, foreign_key: :creator_ledger_id)
    has_many(:bills, through: [:charges, :bill])
    timestamps()
  end

  @doc """
  A user ledger changeset for registration.
  """
  def registration_changeset(%UserLedger{} = user_ledger, attrs) do
    user_ledger
    |> cast(attrs, [:user_id])
    |> validate_required([:user_id])
  end
end
