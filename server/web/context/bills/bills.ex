defmodule Nimble.Bills do
  @moduledoc false
  use Nimble.Web, :context

  alias Nimble.Bill
  alias Nimble.Bills.Query
  alias Nimble.Repo

  def for_group(group_id) do
    bills =
      from(b in Bill, where: b.group_id == ^group_id)
      # |> Query.apply(filter: %{"description" => %{"$ilike" => "%good%"}})
      |> Repo.all()
      |> Repo.preload([:items, :charges])

    {:ok, bills}
  end

  def for_user(user) do
    bills =
      user
      |> assoc(:associated_bills)
      # |> Query.apply(filter: %{"description" => %{"$ilike" => "%good%"}})
      |> Repo.all()
      |> Repo.preload([:items, :charges])

    {:ok, bills}
  end

  def create(group_id, creator_id, params) do
    attrs = Map.merge(params, %{"creator_id" => creator_id, "group_id" => group_id})

    %Bill{}
    |> Bill.create_changeset(attrs)
    |> Repo.insert()
  end
end
