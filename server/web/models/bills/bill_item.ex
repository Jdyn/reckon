defmodule Nimble.BillItem do
  @moduledoc """
  Defines a BillItem model to track a bill's items.
  BillItems's are optional and are used to describe the bill's total.
  """
  use Nimble.Web, :model

  alias Nimble.Bill

  schema "bills_items" do
    field(:description, :string)
    field(:notes, :string)
    field(:cost, Money.Ecto.Composite.Type, default_currency: :USD)

    belongs_to(:bill, Bill)

    timestamps()
  end

  def create_changeset(bill_item, attrs \\ %{}) do
    bill_item
    |> cast(attrs, [:description, :notes, :cost])
    |> validate_required([:description, :cost])
  end
end
