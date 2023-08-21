defmodule Nimble.Group do
  use Nimble.Web, :model

  alias Nimble.User
  alias Nimble.GroupMember

  schema "groups" do
    field :name, :string

    belongs_to :creator, User

    many_to_many :members, User, join_through: GroupMember

    timestamps()
  end

  @doc false
  def changeset(group, attrs) do
    group
    |> cast(attrs, [:name, :creator_id])
    |> validate_required([:name, :creator_id])
  end
end
