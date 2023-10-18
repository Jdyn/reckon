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

  def join(conn, %{"group_id" => group_id}) do
    user = current_user(conn)

    with :ok <- GroupInvites.accept_invite(group_id, user_id: user.id) do
      json(conn, %{ok: true})
    end
  end

  def join(conn, %{"token" => token}) do
    user = current_user(conn)

    # TODO: Join through a token which would be recieved through an email or phone link...
  end
end
