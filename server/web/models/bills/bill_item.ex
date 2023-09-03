defmodule Nimble.BillItem do
  @moduledoc"""
  Defines a BillItem model to track a bill's items.
  BillItems's are optional and are used to describe the bill's total.
  """
  use Nimble.Web, :model

  alias Nimble.Bill

  schema "bills_items" do
    field(:description, :string)
    field(:notes, :string)
    field(:cost, Money.Ecto.Composite.Type)

    belongs_to(:bill, Bill)

    timestamps()
  end
end
