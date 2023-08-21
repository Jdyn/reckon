defmodule Nimble.GroupController do
  use Nimble.Web, :controller

  alias Nimble.Groups
  alias Nimble.Group

  action_fallback Nimble.ErrorController

  def index(conn, _params) do
    current_user = conn.assigns[:current_user]
    groups = Groups.list_user_groups(current_user)
    render(conn, :index, groups: groups)
  end

  def create(conn, params) do
    with {:ok, %Group{} = group} <- Groups.create_group(params) do
      conn
      |> put_status(:created)
      |> render(:show, group: group)
    end
  end

  def show(conn, %{"id" => id}) do
    group = Groups.get_group!(id)
    render(conn, :show, group: group)
  end

  def update(conn, %{"id" => id, "group" => group_params}) do
    group = Groups.get_group!(id)

    with {:ok, %Group{} = group} <- Groups.update_group(group, group_params) do
      render(conn, :show, group: group)
    end
  end

  def delete(conn, %{"id" => id}) do
    group = Groups.get_group!(id)

    with {:ok, %Group{}} <- Groups.delete_group(group) do
      send_resp(conn, :no_content, "")
    end
  end
end
