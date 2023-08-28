defmodule Nimble.SessionController do
  use Nimble.Web, :controller

  alias Nimble.Accounts

  action_fallback(Nimble.ErrorController)

  @doc """
  Shows all sessions associated with a user.
  """
  def index(conn, _params) do
    current_user = conn.assigns[:current_user]

    tokens = Accounts.find_all_sessions(current_user)
    render(conn, :index, tokens: tokens)
  end

  @doc """
  Shows the current session that the user is requesting from user.
  """
  def show(conn, _params) do
    current_user = conn.assigns[:current_user]
    token = get_session(conn, :user_token)

    token = Accounts.find_session(current_user, token: token)
    render(conn, :show, token: token)
  end

  @doc """
  Deletes a session associated with a user.
  """
  def delete(conn, %{"tracking_id" => tracking_id}) do
    user = conn.assigns[:current_user]
    token = get_session(conn, :user_token)

    with :ok <- Accounts.delete_session_token(user, tracking_id, token) do
      json(conn, %{ok: true})
    end
  end

  @doc """
  Deletes all sessions associated with a user, except the current one.
  """
  def delete_all(conn, _params) do
    user = conn.assigns[:current_user]
    token = get_session(conn, :user_token)

    with token <- Accounts.delete_session_tokens(user, token) do
      render(conn, :index, tokens: [token])
    end
  end
end
