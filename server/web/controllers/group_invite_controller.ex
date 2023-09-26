defmodule Nimble.GroupInviteController do
  @moduledoc false
  use Nimble.Web, :controller

  alias Nimble.Groups.GroupInvites

  action_fallback(Nimble.ErrorController)

  def index(conn, _params) do
    render(conn, "index.json", invites: GroupInvites.list_group_invites(conn.assigns[:group_id]))
  end

  def create(conn, params) do
    user = current_user(conn)
    group_id = conn.assigns[:group_id]

    with {:ok, message} <- GroupInvites.invite(group_id, user, params) do
      conn
      |> put_status(:created)
      |> json(%{ message: message })
    end
  end
end
