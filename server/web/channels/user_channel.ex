defmodule Nimble.UserChannel do
  @moduledoc false
  use Nimble.Web, :channel

  alias Nimble.GroupInviteJSON
  alias Nimble.Groups.GroupInvites

  def join("user:notifications", _params, socket) do
    send(self(), :load_invites)
    {:ok, socket}
  end

  def handle_info(:load_invites, socket) do
    user = socket.assigns.user

    invites = GroupInviteJSON.index(%{invites: GroupInvites.find_invites(user)})

    push(socket, "invites", %{invites: invites})

    {:noreply, socket}
  end
end
