defmodule Nimble.GroupController do
  use Nimble.Web, :controller

  alias Nimble.Group
  alias Nimble.Groups

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

  def show(conn, %{"group_id" => group_id}) do
    current_user = conn.assigns[:current_user]

    with {:ok, group} <- Groups.get_group_for_user(current_user.id, group_id) do
      render(conn, :show, group: group)
    end
  end

  def update(conn, %{"group_id" => id, "group" => group_params}) do
    group = Groups.get_group!(id)

    with {:ok, %Group{} = group} <- Groups.update_group(group, group_params) do
      render(conn, :show, group: group)
    end
  end

  def invite(conn, %{ "group_id" => group_id, "identifier" => identifier} = _params) do
    current_user = conn.assigns[:current_user]
    Groups.invite_member(group_id, current_user, identifier)
    send_resp(conn, :no_content, "")
  end

  def delete(conn, %{"group_id" => id}) do
    group = Groups.get_group!(id)

    with {:ok, %Group{}} <- Groups.delete_group(group) do
      send_resp(conn, :no_content, "")
    end
  end
end
