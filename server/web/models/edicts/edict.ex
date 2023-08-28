defmodule Nimble.Edict do
  use Nimble.Web, :model

  schema "edicts" do

    field(:description, :string)
    field(:amount, Money.Ecto.Composite.Type)

    timestamps()
  end
end
