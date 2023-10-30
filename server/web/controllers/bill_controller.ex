defmodule Nimble.BillController do
  use Nimble.Web, :controller

  alias Nimble.Bill
  alias Nimble.Bills

  action_fallback(Nimble.ErrorController)

  def global_bills(conn, _params) do
    user = current_user(conn)

    with {:ok, bills} <- Bills.index(%{user_id: user.id}, :global) do
      render(conn, "external_index.json", bills: bills)
    end
  end

  def group_bills(conn, _params) do
    group_id = conn.assigns[:group_id]
    user = current_user(conn)

    with {:ok, bills} <- Bills.index(%{group_id: group_id, user_id: user.id}, :group) do
      render(conn, "index.json", bills: bills)
    end
  end

  def user_bills(conn, _params) do
    user = current_user(conn)

    with {:ok, bills} <- Bills.index(%{user: user}, :user) do
      render(conn, "user_index.json", bills: bills)
    end
  end

  def show(conn, %{"id" => bill_id}) do
    with bill = %Bill{} <- Bills.get_bill(bill_id) do
      render(conn, "show.json", bill: bill)
    end
  end

  def create(conn, params) do
    %{group_id: group_id } = conn.assigns
    user = current_user(conn)

    params = Map.merge(params, %{"creator_id" => user.id, "group_id" => group_id})

    with {:ok, bill} <- Bills.create(params) do
      render(conn, "show.json", bill: bill)
    end
  end

  def update_charge(conn, %{"id" => charge_id} = params) do
    user = current_user(conn)

    with {:ok, _charge} <- Bills.update_charge(charge_id, user.id, params) do
      json(conn, %{ok: true})
    end
  end

  def like(conn, %{"bill_id" => bill_id}) do
    user = current_user(conn)

    Bills.like(bill_id, user.id)
    json(conn, %{ok: true})
  end
end
