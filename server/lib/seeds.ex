defmodule Nimble.Seed do
  @moduledoc false
  alias Nimble.Repo
  alias Nimble.Accounts

  def run do
    Accounts.register(%{
      full_name: "Albert",
      username: "RelativelySpeaking",
      identifier: "test@test.com",
      password: "Password1234"
    })

    Accounts.register(%{
      full_name: "Michael",
      username: "RealBatman",
      identifier: "test@test1.com",
      password: "Password1234"
    })

    Accounts.register(%{
      full_name: "Margot",
      username: "Barbie123",
      identifier: "test@test2.com",
      password: "Password1234"
    })

    Accounts.register(%{
      full_name: "Julius",
      username: "TheBringer",
      identifier: "test@test3.com",
      password: "Password1234"
    })

    Accounts.register(%{
      full_name: "Joe",
      username: "TheDirt",
      identifier: "test@test4.com",
      password: "Password1234"
    })

    Accounts.register(%{
      full_name: "David",
      username: "TheMagician",
      identifier: "test@test5.com",
      password: "Password1234"
    })

    Accounts.register(%{
      full_name: "Alice",
      username: "AgileAlice2",
      identifier: "test@test6.com",
      password: "Password1234"
    })

    Accounts.register(%{
      full_name: "Max",
      username: "PlankMan54",
      identifier: "test@test7.com",
      password: "Password1234"
    })

    users = Repo.all(Nimble.User)

    Nimble.Groups.create_group(%{
      "name" => "Derby Gang",
      "creator_id" => List.first(users).id
    })

    for user <- users do
      Nimble.Groups.add_member(1, user.id)
    end
  end
end
