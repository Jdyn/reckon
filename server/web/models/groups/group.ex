defmodule Nimble.Group do
  @moduledoc false
  use Nimble.Web, :model

  alias Nimble.Bill
  alias Nimble.BillCategory
  alias Nimble.GroupMember
  alias Nimble.User

  schema "groups" do
    field(:name, :string)

    has_many(:bills, Bill)
    has_many(:bill_categories, BillCategory)

    many_to_many(:members, User, join_through: GroupMember)

    belongs_to(:creator, User)

    timestamps()
  end

  @doc false
  def changeset(group, attrs) do
    group
    |> cast(attrs, [:name, :creator_id])
    |> validate_required([:name, :creator_id])
  end
end
