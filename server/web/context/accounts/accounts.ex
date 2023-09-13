defmodule Nimble.Accounts do
  @moduledoc """
  Defines a context for managing user accounts.
  """
  alias Nimble.Accounts.Query
  alias Nimble.Accounts.Users
  alias Nimble.Auth.OAuth
  alias Nimble.Repo
  alias Nimble.User
  alias Nimble.UserLedger
  alias Nimble.UserToken

  @doc """
  Authenticates a user.

  ## Examples

      iex> authenticate("email", "password")
      {:ok, %User{}}

      iex> authenticate("email", "bad_password")
      {:unauthorized, "Email or Password is incorrect."}

      iex> authenticate("bad_email", "password")
      {:unauthorized, "Email or Password is incorrect."}

  """
  @spec authenticate(binary, binary) :: {:ok, User.t()} | {:unauthorized, String.t()}
  def authenticate(identifier, password) when is_binary(identifier) and is_binary(password) do
    with %User{} = user <- Users.get_by_identifier_and_password(identifier, password) do
      {:ok, user}
    else
      _ ->
        {:unauthorized, "Email or Password is incorrect."}
    end
  end

  @spec authenticate(binary, map) :: {:ok, User.t()} | {:unauthorized, String.t()}
  def authenticate(provider, %{} = params) when is_binary(provider) and is_map(params) do
    case OAuth.callback(provider, params) do
      {:ok, %{user: open_user, token: _token}} ->
        with user = %User{} <- Users.get_by_identifier(open_user["email"]),
             false <- is_nil(user.confirmed_at) do
          {:ok, user}
        else
          true ->
            {:unauthorized, "Confirm your email before signing in with #{provider}."}

          nil ->
            register(open_user, :oauth)
        end

      error ->
        error
    end
  end

  @doc """
  Registers a user.

  ## Examples

      iex> register(%{field: value})
      {:ok, %User{}}

      iex> register(%{field: bad_value})
      {:error, %Ecto.Changeset{}}
  """
  def register(attrs) do
    with {:ok, %{user: user, ledger: _ledger}} <-
           Ecto.Multi.new()
           |> Ecto.Multi.insert(:user, User.registration_changeset(%User{}, attrs))
           |> Ecto.Multi.insert(:ledger, fn %{user: user} ->
             UserLedger.registration_changeset(%UserLedger{}, %{user_id: user.id})
           end)
           |> Repo.transaction() do
      {:ok, user}
    end
  end

  def register(attrs, :oauth) do
    oauth_user = user_from_oauth(attrs)
    %User{} |> User.oauth_registration_changeset(oauth_user) |> Repo.insert()
  end

  defp user_from_oauth(attrs) do
    %{
      email: attrs["email"],
      email_verified: attrs["email_verified"],
      first_name: attrs["given_name"],
      last_name: attrs["family_name"],
      avatar: attrs["picture"]
    }
  end

  @doc """
  Gets the user by reset password token.

  ## Examples

    iex> get_user_by_reset_password_token("validtoken")
    %User{}

    iex> get_user_by_reset_password_token("invalidtoken")
    nil
  """
  def get_user_by_reset_password_token(token) do
    with {:ok, query} <- UserToken.verify_email_token_query(token, "reset_password"),
         %User{} = user <- Repo.one(query) do
      {:ok, user}
    else
      _ -> {:error, "Reset password link is invalid or it has expired."}
    end
  end

  @doc """
  Returns all tokens for the given user.
  """
  def find_all_tokens(user), do: Repo.all(Query.user_and_contexts_query(user, ["all"]))
end
