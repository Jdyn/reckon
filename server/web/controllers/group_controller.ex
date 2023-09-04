defmodule Nimble.GroupController do
  use Nimble.Web, :controller

  alias Nimble.Group
  alias Nimble.Groups
  alias Nimble.Groups.GroupInvites

  action_fallback(Nimble.ErrorController)

  def index(conn, _params) do
    current_user = conn.assigns[:current_user]
    groups = Groups.list_user_groups(current_user)
    render(conn, :index, groups: groups)
  end

  def create(conn, params) do
    current_user = conn.assigns[:current_user]
    params = Map.put(params, "creator_id", current_user.id)

    with {:ok, %Group{} = group} <- Groups.create_group(params) do
      conn
      |> put_status(:created)
      |> render(:show, group: group)
    end
  end

  def show(conn, _params) do
    %{group_id: group_id, current_user: current_user} = conn.assigns

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

  def join(conn, %{"group_id" => group_id}) do
    current_user = conn.assigns[:current_user]

    with {:ok, _group} <- GroupInvites.accept_invite(group_id, current_user.id) do
      json(conn, %{ok: true})
    end
  end

  def delete(conn, %{"group_id" => id}) do
    group = Groups.get_group!(id)

    with {:ok, %Group{}} <- Groups.delete_group(group) do
      send_resp(conn, :no_content, "")
    end
  end
end
