defmodule Nimble.GroupInviteController do
  @moduledoc false
  use Nimble.Web, :controller

  alias Nimble.Groups.GroupInvites

  action_fallback(Nimble.ErrorController)

  def create(conn, params) do
    %{group_id: group_id, current_user: current_user} = conn.assigns

    with {:ok, _invite} <- GroupInvites.invite_member(group_id, current_user.id, params) do
      json(conn, %{ok: true, message: "An invite has been sent!"})
    end
  end
end
