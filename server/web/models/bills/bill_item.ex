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

  def valid_costs?(total, bill_items) do
    item_total = sum_costs(bill_items)

    case Money.cmp(item_total, total) do
      1 ->
        :greater

      0 ->
        :equal

      -1 ->
        :less
    end
  end

  @doc """
    Takes in a list of BillItem `Ecto.Changeset`s and sums the cost within the 'changes' field
    of each changeset. Returns the sum as a Money struct.

    ## Example
      iex> sum_costs([
        #Ecto.Changeset<changes: %{ cost: Money.new(:USD, "10") }>,
        #Ecto.Changeset<changes: %{ cost: Money.new(:USD, "20") }>
      ])
      Money.new(:USD, "30")
  """
  @spec sum_costs([Ecto.Changeset.t()]) :: Money.t()
  def sum_costs(item_changesets) do
    Enum.reduce(item_changesets, Money.new(:USD, 0), fn item_changeset, acc ->
      with money = %Money{} <- get_change(item_changeset, :cost) do
        Money.add!(acc, money)
      else
        _ -> acc
      end
    end)
  end
end
