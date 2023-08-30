defmodule Nimble.Edict.Contribution do
  @moduledoc """
  Defines a Edict.Contribution model to track a user's contribution to an edict.
  """
  use Nimble.Web, :model

  alias Nimble.Edict
  alias Nimble.Edict.Contribution
  alias Nimble.User
  alias Nimble.UserLedger

  schema "edicts_contributions" do
    field(:amount, Money.Ecto.Composite.Type)

    belongs_to(:edict, Edict)
    belongs_to(:creator_ledger, UserLedger, foreign_key: :creator_ledger_id)
    belongs_to(:contributor, User)

    timestamps()
  end

  @doc """
  A edict contribution changeset for registration.
  """
  def changeset(%Contribution{} = contribution, attrs) do
    contribution
    |> cast(attrs, [:amount])
    |> validate_required([:amount])
  end
end
