defmodule Nimble.GroupChannel do
  @moduledoc false
  use Nimble.Web, :channel

  alias Nimble.Groups
  alias Nimble.Presence

  @impl true
  def join("group:" <> group_id, _params, socket) do
    user = socket.assigns.user

    with :ok <- authenticate(group_id, user.id) do
      send(self(), :after_join)

      {:ok, assign(socket, :group_id, group_id)}
    else
      {:error, reason} ->
        {:error, %{reason: reason}}
    end
  end

  @impl true
  def handle_info(:after_join, socket) do
    user = socket.assigns.user
    group_id = socket.assigns.group_id

    with {:ok, _} <- Presence.track(socket, user.id, %{}) do
      push(socket, "presence_state", Presence.list("group:" <> group_id))
    end

    {:noreply, socket}
  end

  defp authenticate(group_id, user_id) do
    with {group_id, _remainder} <- Integer.parse(group_id),
    true <- Groups.is_member?(group_id, user_id) do
      :ok
    else
      _ ->
        {:error, %{reason: "You are not a member, or this group does not exist."}}
    end
  end
end
