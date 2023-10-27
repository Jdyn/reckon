defmodule Nimble.Bills do
  @moduledoc false
  use Nimble.Web, :context

  alias Nimble.Bill
  alias Nimble.BillCharge
  alias Nimble.Bills.Query
  alias Nimble.Repo

  def for_global do
    bills =
      from(b in Bill, order_by: [desc: b.inserted_at], limit: 10)
      # |> Query.apply(filter: %{"description" => %{"$ilike" => "%good%"}})
      |> Repo.all()
      |> Repo.preload([:creator])

    {:ok, bills}
  end

  def for_group(group_id) do
    bills =
      from(b in Bill, where: b.group_id == ^group_id, order_by: [desc: b.inserted_at])
      # |> Query.apply(filter: %{"description" => %{"$ilike" => "%good%"}})
      |> Repo.all()
      |> Repo.preload([:items, :creator, charges: [:user]])

    {:ok, bills}
  end

  def for_user(user) do
    bills =
      user
      |> assoc(:associated_bills)
      |> order_by([b], desc: b.inserted_at)
      # |> Query.apply(filter: %{"description" => %{"$ilike" => "%good%"}})
      |> Repo.all()
      |> Repo.preload([:items, :group, :creator, charges: [:user]])

    {:ok, bills}
  end

  def create(group_id, creator_id, params) do
    attrs = Map.merge(params, %{"creator_id" => creator_id, "group_id" => group_id})

    %Bill{}
    |> Bill.create_changeset(attrs)
    |> Repo.insert()
    |> case do
      {:ok, bill} ->
        {:ok, Repo.preload(bill, [:items, :creator, charges: [:user]])}

      error ->
        error
    end
  end

  def get_bill(bill_id) do
    Bill
    |> Repo.get(bill_id)
    |> Repo.preload([:items, :group, :creator, charges: [:user]])
  end

  def update_charge(charge_id, user_id, params) do
    dbg params
    with charge = %BillCharge{} <- Repo.one(Query.charge_from_user(charge_id, user_id)) do
      charge
      |> BillCharge.update_charge_changeset(params)
      |> Repo.update()
    else
      _ -> {:error, "Charge not found"}
    end
  end
end
