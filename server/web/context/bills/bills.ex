defmodule Nimble.Bills do
  @moduledoc false
  use Nimble.Web, :context

  alias Nimble.Bill
  alias Nimble.BillCharge
  alias Nimble.Bills.Query
  alias Nimble.Repo
  alias Nimble.UserLike

  def for_global(user_id) do
    bills =
      Bill
      |> order_by([b], desc: b.inserted_at)
      |> join(:left, [b], ul in UserLike, on: ul.bill_id == b.id and ul.user_id == ^user_id)
      |> limit(10)
      |> select([b, ul], %{b | liked: not is_nil(ul.id)})
      |> dbg
      |> Repo.all()
      |> Repo.preload([:creator])

    {:ok, bills}
  end

  def for_group(group_id, user_id) do
    bills =
      from(b in Bill, where: b.group_id == ^group_id, order_by: [desc: b.inserted_at])
      |> join(:left, [b], ul in UserLike, on: ul.bill_id == b.id and ul.user_id == ^user_id)
      |> select([b, ul], %{b | liked: not is_nil(ul.id)})
      |> Repo.all()
      |> Repo.preload([:items, :creator, charges: [:user]])

    {:ok, bills}
  end

  def for_user(user) do
    bills =
      user
      |> assoc(:associated_bills)
      |> order_by([b], desc: b.inserted_at)
      |> join(:left, [b], ul in UserLike, on: ul.bill_id == b.id and ul.user_id == ^user.id)
      |> select([b, bc, ul], %{b | liked: not is_nil(ul.id)})
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
    with charge = %BillCharge{} <- Repo.one(Query.charge_from_user(charge_id, user_id)) do
      charge
      |> BillCharge.update_charge_changeset(params)
      |> Repo.update()
    else
      _ -> {:error, "Charge not found"}
    end
  end

  def like(bill_id, user_id) do
    case Repo.one(from(l in UserLike, where: l.bill_id == ^bill_id, where: l.user_id == ^user_id)) do
      nil ->
        %UserLike{}
        |> UserLike.changeset(%{"bill_id" => bill_id, "user_id" => user_id})
        |> Repo.insert()

        inc_likes(bill_id, 1)

      like ->
        Repo.delete(like)
        inc_likes(bill_id, -1)
    end
  end

  def liked?(bill_id, user_id) do
    Repo.exists?(from(l in UserLike, where: l.bill_id == ^bill_id, where: l.user_id == ^user_id))
  end

  def inc_likes(bill_id, value) do
    Repo.update_all(from(b in Bill, where: b.id == ^bill_id, update: [inc: [like_count: ^value]]), [])
    :ok
  end
end
