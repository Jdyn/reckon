defmodule Nimble.BillController do
  use Nimble.Web, :controller

  alias Nimble.Bills

  action_fallback(Nimble.ErrorController)

  def global_bills(conn, _params) do
    with {:ok, bills} <- Bills.for_global() do
      render(conn, "external_index.json", bills: bills)
    end
  end

  def group_bills(conn, _params) do
    group_id = conn.assigns[:group_id]

    with {:ok, bills} <- Bills.for_group(group_id) do
      render(conn, "index.json", bills: bills)
    end
  end

  def user_bills(conn, _params) do
    user = current_user(conn)

    with {:ok, bills} <- Bills.for_user(user) do
      render(conn, "user_index.json", bills: bills)
    end
  end

  def create(conn, params) do
    %{group_id: group_id, current_user: current_user} = conn.assigns

    with {:ok, bill} <- Bills.create(group_id, current_user.id, params) do
      render(conn, "show.json", bill: bill)
    end
  end

  def approve_charge(conn, %{"id" => id}) do
    user = current_user(conn)

    with {:ok, _charge} <- Bills.approve_charge(id, user.id) do
      json(conn, %{ok: true})
    end
  end
end
