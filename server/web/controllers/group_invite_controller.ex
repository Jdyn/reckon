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

    case GroupInvites.invite_member(group_id, current_user.id, params) do
      {:ok, {:user, _invite}} ->
        json(conn, %{ok: true, message: "An invite has been sent to the existing user!"})

      {:ok, {:nonuser, _invite}} ->
        json(conn, %{ok: true, message: "An invite has been sent to the nonexisting user!"})

      {:found, {:nonuser, _invite}} ->
        json(conn, %{ok: true, message: "An invite has been resent to the nonexisting user!"})
    end
  end
end
