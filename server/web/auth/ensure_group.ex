defmodule Nimble.Auth.EnsureGroup do
  @moduledoc """
  Used for routes that require the user to be in the group.
  Expects a `group_id` to be assigned to the connection.
  """
  use Phoenix.Controller

  import Plug.Conn

  alias Nimble.Groups

  def init(opts), do: opts

  def call(conn, _opts \\ %{}) do
    current_user = conn.assigns[:current_user]

    with {:ok, group_id} <- Map.fetch(conn.path_params, "group_id"),
    true <- Groups.is_member?(group_id, current_user.id) do
      conn
    else
      _ ->
        conn
        |> put_status(:unauthorized)
        |> put_view(Nimble.ErrorJSON)
        |> render("error.json", error: "You do not have access to this resource.")
        |> halt()
    end
  end
end
