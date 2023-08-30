defmodule Nimble.GroupMember do
  @moduledoc false
  use Nimble.Web, :model

  alias Nimble.Group
  alias Nimble.User

  schema "groups_members" do
    belongs_to(:group, Group)
    belongs_to(:user, User)

    timestamps()
  end

  @doc false
  def changeset(group, attrs) do
    group
    |> cast(attrs, [:group_id, :user_id])
    |> validate_required([:group_id, :user_id])
    |> unique_constraint(:group, name: :no_duplicate_members)
  end

  @doc false
  def update_changeset(group, attrs) do
    cast(group, attrs, [:updated_at])
  end
end
