defmodule Nimble.Seed do
  @moduledoc false
  alias Nimble.Repo
  alias Nimble.Accounts

  def run do
    Accounts.register(%{
      full_name: "Albert Einstein",
      username: "RelativelySpeaking",
      identifier: "test@test.com",
      password: "Password1234"
    })

    Accounts.register(%{
      full_name: "Michael Faraday",
      username: "RealBatman",
      identifier: "test@test1.com",
      password: "Password1234"
    })

    Accounts.register(%{
      full_name: "Margot Robbie",
      username: "Barbie123",
      identifier: "test@test2.com",
      password: "Password1234"
    })

    Accounts.register(%{
      full_name: "Julius Opppenheimer",
      username: "TheBringer",
      identifier: "test@test3.com",
      password: "Password1234"
    })

    Accounts.register(%{
      full_name: "Joe Dirt",
      username: "TheDirt",
      identifier: "test@test4.com",
      password: "Password1234"
    })

    Accounts.register(%{
      full_name: "David Blaine Einstein",
      username: "TheMagician",
      identifier: "test@test5.com",
      password: "Password1234"
    })

    Accounts.register(%{
      full_name: "Alice Wonder",
      username: "AgileAlice2",
      identifier: "test@test6.com",
      password: "Password1234"
    })

    Accounts.register(%{
      full_name: "Max Planck",
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
