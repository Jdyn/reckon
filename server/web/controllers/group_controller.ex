defmodule Nimble.GroupController do
  use Nimble.Web, :controller

  alias Nimble.Group
  alias Nimble.Groups

  action_fallback(Nimble.ErrorController)

  def index(conn, _params) do
    user = current_user(conn)
    groups = Groups.list_user_groups(user)
    render(conn, :index, groups: groups)
  end

  def list_members(conn, _params) do
    group_id = current_group_id(conn)
    members = Groups.list_members(group_id)
    render(conn, :members, members: members)
  end

  def create(conn, params) do
    user = current_user(conn)
    params = Map.put(params, "creator_id", user.id)

    with {:ok, %Group{} = group} <- Groups.create_group(params) do
      conn
      |> put_status(:created)
      |> render(:show, group: group)
    end
  end

  def show(conn, _params) do
    current_user = current_user(conn)
    group_id = current_group_id(conn)

    with {:ok, group} <- Groups.get_group_for_user(group_id, current_user.id) do
      render(conn, :show, group: group)
    end
  end

  def update(conn, %{"group_id" => id, "group" => group_params}) do
    group = Groups.get_group!(id)

    with {:ok, %Group{} = group} <- Groups.update_group(group, group_params) do
      render(conn, :show, group: group)
    end
  end

  def leave(conn, _params) do
    user = current_user(conn)
    group_id = current_group_id(conn)

    with :ok <- Groups.leave(group_id, user.id) do
      json(conn, %{ok: true})
    end
  end

  def delete(conn, _params) do
    group_id = current_group_id(conn)
    group = Groups.get_group!(group_id)
    user = current_user(conn)

    with true <- user.id == group.creator_id,
         {:ok, %Group{}} <- Groups.delete_group(group) do
      send_resp(conn, :no_content, "")
    end
  end

  defp current_group_id(conn), do: conn.assigns[:group_id]
end
