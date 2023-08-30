defmodule Nimble.Edict do
  @moduledoc false
  use Nimble.Web, :model

  schema "edicts" do
    field(:description, :string)
    field(:cost, Money.Ecto.Composite.Type)

    has_many(:contributions, Nimble.Edict.Contribution)

    many_to_many(:contributors, Nimble.User, join_through: Nimble.Edict.Contributor)

    belongs_to(:creator, Nimble.User)
    belogns_to(:group, Nimble.Group)

    timestamps()
  end
end
