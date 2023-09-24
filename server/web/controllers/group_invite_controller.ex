defmodule Nimble.GroupInviteController do
  @moduledoc false
  use Nimble.Web, :controller

  alias Nimble.Groups.GroupInvites

  action_fallback(Nimble.ErrorController)

  def index(conn, _params) do
    render(conn, "index.json", invites: GroupInvites.list_group_invites(conn.assigns[:group_id]))
  end

  def create(conn, params) do
    %{group_id: group_id, current_user: current_user} = conn.assigns

    with {:ok, message} <- GroupInvites.invite(group_id, current_user, params) do
      conn
      |> put_status(:created)
      |> json(%{ message: message })
    end
  end
end
