defmodule Nimble.BillController do
  use Nimble.Web, :controller

  alias Nimble.Bills

  action_fallback(Nimble.ErrorController)

  def create(conn, params) do
    %{group_id: group_id, current_user: current_user} = conn.assigns

    with {:ok, bill} <- Bills.create(group_id, current_user.id, params) do
      render(conn, "show.json", bill: bill)
    end
  end
end
