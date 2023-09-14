defmodule Nimble.BillTest do
  use Nimble.DataCase

  import Nimble.BillsFixtures

  alias Nimble.Bill

  describe "create_changeset/2" do
    setup do
      %{attrs: valid_bill_attributes()}
    end

    test "valid changeset works", %{attrs: attrs} do
      changeset = Bill.create_changeset(%Bill{}, attrs)
      assert changeset.valid?
    end
  end

  describe "build_even_split/1" do
    test "valid split with charges" do
      changeset = %Ecto.Changeset{
        params: %{
          "total" => Money.new(150, :USD),
          "charges" => [
            %{},
            %{}
          ]
        },
        changes: %{total: Money.new(150, :USD)}
      }

      expected_result = %Ecto.Changeset{
        params: %{
          "total" => Money.new(150, :USD),
          "charges" => [
            %{"amount" => Money.new("75.00", :USD)},
            %{"amount" => Money.new("75.00", :USD)}
          ]
        }
      }

      assert Bill.build_even_split(changeset).params == expected_result.params
    end
  end
end
