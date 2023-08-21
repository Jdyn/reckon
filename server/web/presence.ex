defmodule Nimble.Presence do
  @moduledoc false
  use Phoenix.Presence,
    otp_app: :nimble,
    pubsub_server: Nimble.PubSub

  use Nimble.Web, :context

  alias Nimble.GroupMember
  alias Nimble.Repo
  alias Nimble.User

  @impl true
  def fetch("group:" <> group_id, presences) do
    query =
      from(m in GroupMember, where: m.group_id == ^group_id, join: u in User, on: m.user_id == u.id, select: {u.id, u})

    group_members = query |> Repo.all() |> Map.new()

    dbg presences

      for {key, user} <- group_members, into: %{} do
        if Map.has_key?(presences, key) do
          metas = Map.get(presences, key).metas
          {key, %{metas: metas, user: Map.merge(Nimble.UserJSON.user(user), metas)}}
        else
          {key, %{metas: %{}, user: Map.merge(Nimble.UserJSON.user(user), %{})}}
        end
      end
      |> dbg
  end

  @impl true
  def fetch(_topic, presences) do
    presences
  end
end
