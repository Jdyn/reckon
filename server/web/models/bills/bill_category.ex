defmodule Nimble.BillCategory do
  @moduledoc false
  use Nimble.Web, :model

  alias Nimble.Bill
  alias Nimble.Group

  schema "bills_categories" do
    field(:name, :string)
    field(:color, :string)

    belongs_to(:group, Group)

    has_many(:bills, Bill, foreign_key: :category_id)

    timestamps()
  end

  def create_changeset(bill_category, attrs \\ %{}) do
    bill_category
    |> cast(attrs, [:name, :color, :group_id])
    |> validate_required([:name, :group_id])
    |> unique_constraint(:name, name: :no_duplicate_categories)
  end
end
