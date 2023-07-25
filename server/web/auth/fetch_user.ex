defmodule Reckon.Auth.FetchUser do
  import Plug.Conn
  use Phoenix.Controller

  alias Reckon.Accounts

  @remember_token "remember_token"

  def init(opts), do: opts

  @doc """
  Authenticates the user by looking into the session
  and remember me token.
  """
  def call(conn, _opts \\ %{}) do
    {token, conn} = ensure_user_token(conn)

    user =
      token &&
        ConCache.get_or_store(:user_cache, token, fn ->
          Accounts.find_by_session_token(token)
        end)

    assign(conn, :current_user, user)
  end

  defp ensure_user_token(conn) do
    if user_token = get_session(conn, :user_token) do
      {user_token, conn}
    else
      conn = fetch_cookies(conn, signed: [@remember_token])

      if user_token = conn.cookies[@remember_token] do
        {user_token, put_session(conn, :user_token, user_token)}
      else
        {nil, conn}
      end
    end
  end
end
