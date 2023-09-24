defmodule Nimble.BillsFixtures do
  @moduledoc false
  import Nimble.AccountsFixtures
  import Nimble.GroupsFixtures

  def valid_bill_attributes(attrs \\ %{}) do
    creator = user_fixture()

    Enum.into(attrs, %{
      "description" => "Test Bill",
      "total" => Money.new(1000, :USD),
      "status" => "pending",
      "group_id" => group_fixture(%{:creator_id => creator.id}).id,
      "creator_id" => creator.id,
      "options" => %{
        "requires_confirmation" => false,
        "start_date" => nil,
        "due_date" => nil
      },
      "items" => [
        %{
          "description" => "Test Item 1",
          "cost" => Money.new(500, :USD)
        },
        %{
          "description" => "Test Item 2",
          "cost" => Money.new(500, :USD)
        }
      ],
      "charges" => [
        %{
          "user_id" => user_fixture().id,
          "split_percent" => "50.0"
        },
        %{
          "user_id" => user_fixture().id,
          "split_percent" => "50.0"
        }
      ]
    })
  end
end
