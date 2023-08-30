defmodule Nimble.UserLedger do
  @moduledoc """
  Defines a UserLedger model to track a user's ledger.
  """
  use Nimble.Web, :model

  alias Nimble.User
  alias Nimble.UserLedger

  schema "users_ledgers" do
    field(:balance, Money.Ecto.Composite.Type)

    belongs_to(:user, User, foreign_key: :user_id)

    has_many(:edicts, through: [:user, :edicts])
    has_many(:contributions, Nimble.Edict.Contribution)

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
