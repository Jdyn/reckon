defmodule Reckon.Auth.EnsureAuth do
  import Plug.Conn
  use Phoenix.Controller

  alias Reckon.ErrorView

  def init(opts), do: opts

  @doc """
  Used for routes that require the user to be authenticated.
  """
  def call(conn, _opts \\ %{}) do
    if conn.assigns[:current_user] do
      conn
    else
      conn
      |> put_status(:unauthorized)
      |> put_view(ErrorView)
      |> render("error.json", error: "You do not have access to this resource.")
      |> halt()
    end
  end
end
