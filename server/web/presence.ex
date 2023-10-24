defmodule Nimble.Presence do
  @moduledoc false
  use Phoenix.Presence,
    otp_app: :nimble,
    pubsub_server: Nimble.PubSub

  use Nimble.Web, :context

  # alias Nimble.GroupMember
  # alias Nimble.Repo
  # alias Nimble.User

  # @impl true
  # def fetch("group:" <> group_id, presences) do
  #   query =
  #     from(m in GroupMember,
  #       where: m.group_id == ^group_id,
  #       join: u in User,
  #       on: m.user_id == u.id,
  #       select: {u.id, %{u | updated_at: m.updated_at}}
  #     )

  #   group_members = query |> Repo.all() |> Map.new(fn {k, v} -> {Integer.to_string(k), v} end)

  #   for {key, user} <- group_members, into: %{} do
  #     if Map.has_key?(presences, key) do
  #       %{metas: metas} = Map.get(presences, key)
  #       {key, %{metas: metas, user: Nimble.UserJSON.user(user)}}
  #     else
  #       {key, %{metas: [], user: Nimble.UserJSON.user(user)}}
  #     end
  #   end
  # end

  # @impl true
  # def fetch(_topic, presences) do
  #   presences
  # end
end
