defmodule Nimble.Auth.EnsureGroup do
  @moduledoc """
  Used for routes that require the user to be in the group.
  Expects a `group_id` or `id` to be assigned to the connection.
  """
  use Phoenix.Controller

  import Nimble.Groups, only: [is_member?: 2]
  import Plug.Conn

  def init(opts), do: opts

  def call(conn, _opts \\ %{}) do
    current_user = conn.assigns[:current_user]

    # Get the group_id from the path_params by either `id` or `group_id`
    group_id = Map.get(conn.path_params, "id") || Map.get(conn.path_params, "group_id")

    if not is_nil(group_id) and is_member?(group_id, current_user.id) do
      conn
    else
      conn
      |> put_status(:unauthorized)
      |> put_view(Nimble.ErrorJSON)
      |> render("error.json", error: "You do not have access to this resource.")
      |> halt()
    end
  end
end
