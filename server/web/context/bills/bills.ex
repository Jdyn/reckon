defmodule Nimble.Bills do
  @moduledoc false
  use Nimble.Web, :context

  alias Nimble.Bill
  alias Nimble.BillCharge
  alias Nimble.Bills.Query
  alias Nimble.Repo
  alias Nimble.User
  alias Nimble.UserLike

  def index(%{user_id: user_id}, :global) do
    {:ok,
     Bill
     |> join_liked(user_id)
     |> order_by([b], desc: b.inserted_at)
     |> limit(10)
     |> Repo.all()
     |> Repo.preload([:creator])}
  end

  def index(%{group_id: group_id, user_id: user_id}, :group) do
    query = Query.bill(group_id: group_id)

    {:ok,
     query
     |> join_liked(user_id)
     |> order_by([b], desc: b.inserted_at)
     |> Repo.all()
     |> Repo.preload([:items, :creator, charges: [:user]])}
  end

  def index(%{user: %User{} = user}, :user) do
    {:ok,
     user
     |> assoc(:associated_bills)
     |> join_liked(user.id)
     |> order_by([b], desc: b.inserted_at)
     |> Repo.all()
     |> Repo.preload([:items, :group, :creator, charges: [:user]])}
  end

  def create(params) do
    with {:ok, bill} <-
           %Bill{}
           |> Bill.create_changeset(params)
           |> Repo.insert() do
      {:ok, Repo.preload(bill, [:items, :creator, charges: [:user]])}
    end
  end

  def get_bill(id) do
    bill = Repo.get(Bill, id)
    Repo.preload(bill, [:items, :group, :creator, charges: [:user]])
  end

  def update_charge(charge_id, user_id, params) do
    charge_query = Query.charge(id: charge_id, user_id: user_id)

    with charge = %BillCharge{} <- Repo.one(charge_query) do
      charge
      |> BillCharge.update_charge_changeset(params)
      |> Repo.update()
    else
      _ -> {:error, "Charge not found"}
    end
  end

  def like(bill_id, user_id) do
    case Repo.one(Query.bill_like(bill_id, user_id)) do
      nil ->
        %UserLike{}
        |> UserLike.changeset(%{"bill_id" => bill_id, "user_id" => user_id})
        |> Repo.insert!()

        inc_likes(bill_id, 1)

      like ->
        Repo.delete!(like)
        inc_likes(bill_id, -1)
    end
  end

  def liked?(id, user_id) do
    Repo.exists?(Query.bill_like(id, user_id))
  end

  def join_liked(query, user_id) do
    query
    |> join(:left, [b], ul in UserLike, as: :liked, on: ul.bill_id == b.id and ul.user_id == ^user_id)
    |> select([b, liked: ul], %{b | liked: not is_nil(ul.id)})
  end

  def inc_likes(id, value) do
    Repo.update_all(from(b in Bill, where: b.id == ^id, update: [inc: [like_count: ^value]]), [])
    :ok
  end
end
