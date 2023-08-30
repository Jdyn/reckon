defmodule Nimble.Edict.Contributor do
  @moduledoc """
  Defines a Edict.Contributor join table model to track a user's contribution to an edict.
  """
  use Nimble.Web, :model

  alias Nimble.Edict
  alias Nimble.Edict.Contributor
  alias Nimble.User

  schema "edicts_contributors" do
    belongs_to(:edict, Edict)
    belongs_to(:contributor, User)

    timestamps()
  end

  @doc """
  A edict contributor changeset for creation.
  """
  def changeset(%Contributor{} = contributor, attrs) do
    contributor
    |> cast(attrs, [:edict_id, :contributor_id])
    |> validate_required([:edict_id, :contributor_id])
  end
end
