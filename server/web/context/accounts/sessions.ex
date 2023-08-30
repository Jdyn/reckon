defmodule Nimble.Accounts.Sessions do
  @moduledoc false
  use Nimble.Web, :context

  alias Nimble.Accounts.Query
  alias Nimble.Repo
  alias Nimble.User
  alias Nimble.UserToken

  @doc """
  Generates a session token.

  ## Examples
      iex> create_session_token(user)
      token
  """
  def create_session_token(user) do
    {token, user_token} = UserToken.build_session_token(user)
    Repo.insert!(user_token)
    token
  end

  @doc """
  Retrieve a User by a given signed session token.
  """
  def user_from_session(token) do
    {:ok, query} = UserToken.verify_session_token_query(token)
    Repo.one(query)
  end

  @doc """
  Deletes the current session token.

  ## Examples
      iex> delete_session_token(token)
      :ok
  """
  def delete_session_token(token) do
    Repo.delete_all(Query.token_and_context_query(token, "session"))
    :ok
  end

  @doc """
  Deletes the current session token IF the given token is not the current session token.

  ## Examples
      iex> delete_session_token(user, tracking_id, current_token)
      :ok

      iex> delete_session_token(user, tracking_id_of_current_token, current_token)
      {:not_found, "Cannot delete the current session."}
  """
  def delete_session_token(%User{} = user, tracking_id, current_token) do
    with %{token: token} <- find_session(user, tracking_id: tracking_id),
         true <- token != current_token,
         _ <- Repo.delete_all(Query.user_and_tracking_id_query(user, tracking_id)) do
      :ok
    else
      false ->
        {:not_found, "Cannot delete the current session."}

      nil ->
        {:unauthorized, "Session does not exist."}
    end
  end

  @doc """
  Deletes all session tokens except current session.
  """
  def delete_session_tokens(%User{} = user, token) do
    Repo.delete_all(Query.user_and_session_tokens(user, token))
    find_session(user, token: token)
  end

  @doc """
  Returns all session tokens for the given user.
  """
  def find_sessions(user), do: Repo.all(Query.user_and_contexts_query(user, ["session"]))

  @doc """
  Returns a session token for the given user.
  it can be found by either the tracking_id or the token.

    ## Examples
      iex> find_session(user, tracking_id: tracking_id)
      token

      iex> find_session(user, token: token)
      token
  """
  def find_session(%User{} = user, tracking_id: id) do
    Repo.one(Query.user_and_tracking_id_query(user, id))
  end

  def find_session(%User{} = user, token: token) do
    Repo.one(Query.user_and_token_query(user, token))
  end
end
