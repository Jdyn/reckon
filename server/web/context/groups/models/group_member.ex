defmodule Nimble.GroupMember do
  use Nimble.Web, :model

  alias Nimble.Group
  alias Nimble.User

  schema "groups_members" do

    belongs_to :group, Group
    belongs_to :user, User

    timestamps()
  end

  @doc false
  def changeset(group, attrs) do
    group
    |> cast(attrs, [:group_id, :user_id])
    |> validate_required([:group_id, :user_id])
  end
end
