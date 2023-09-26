defmodule Nimble.Groups.GroupInvites do
  @moduledoc false
  use Nimble.Web, :context

  alias Nimble.Accounts.Users
  alias Nimble.GroupInvite
  alias Nimble.Groups
  alias Nimble.Groups.Query
  alias Nimble.Repo

  @rand_size 16
  @hash_algorithm :sha256

  # def deliver_group_invite_link(%Group{} = group, %User{} = user, sent_to) do
  #   {encoded_token, group_token} = GroupInvite.build_invite_token(group, user, sent_to)
  #   Repo.insert!(group_token)

  #   recipient = Users.get_by_identifier(sent_to)

  #   UserNotifier.deliver_group_invite_instructions(recipient, encoded_token)
  #   {:ok, encoded_token}
  # end

  def list_group_invites(group_id) do
    Repo.all(Query.invites_for_group(group_id))
  end

  @doc """
  Invites an existing user to a group, or sends an invite to a non-existing user.

  ## Examples

      iex> invite(group_id, sender, recipient)
      {:ok, %GroupInvite{}}

  """
  def invite(group_id, sender, %{"recipient" => recipient}) do
    with :ok <- validate_recipient(group_id, recipient["identifier"]),
         {_token, changeset} <- build_invite(group_id, sender, recipient),
         {:ok, _invite} <- Repo.insert(changeset) do
      {:ok, "Invite sent!"}
    end
  end

  @doc """
  Validates that a user has not already been invited to a group
  and that the invite has not expired. If the invite has expired,
  it is deleted.
  """
  def validate_recipient(group_id, identifier) do
    case find_invite(group_id, identifier) do
      %GroupInvite{} = invite ->
        if expired?(invite) do
          delete_invite(invite)
          {:error, "The invite has expired! Please request a new one."}
        else
          {:error, "An invite has already been sent to that user!"}
        end

      _ ->
        :ok
    end
  end

  def find_invite(group_id, identifier) do
    Repo.one(Query.invite_for_user(group_id, identifier: identifier))
  end

  def accept_invite(group_id, user_id: user_id) do
    with %GroupInvite{} = invite <- Repo.one(Query.invite_for_user(group_id, user_id: user_id)),
         {:ok, _member} <- Groups.add_member(group_id, user_id) do
      Repo.delete!(invite)
      :ok
    else
      _ ->
        :error
    end
  end

  # def accept_invite(group_id, token: token) do
    # with %GroupInvite{} = invite <- Repo.one(Query.invite_for_user(group_id, user_id: user_id)),
    #      {:ok, _member} <- Groups.add_member(group_id, user_id) do
    #   Repo.delete!(invite)
    #   :ok
    # else
    #   _ ->
    #     :error
    # end
  # end

  @doc """
  Returns a list of all invites sent to a user.

  ## Examples

      iex> find_invites(user)
      [%GroupInvite{}, ...]
  """
  def find_invites(user) do
    Repo.all(Query.invites_for_user(user.id))
  end

  @doc """
  Deletes a GroupInvite.

  ## Examples

      iex> delete_invite(invite)
      {:ok, %GroupInvite{}}

      iex> delete_invite(invite)
      {:error, %Ecto.Changeset{}}

  """
  def delete_invite(%GroupInvite{} = invite) do
    Repo.delete(invite)
  end

  # def delete_invite(group_id, user_id) when is_binary(group_id) and is_binary(user_id) do
  #   Repo.delete(Query.group_invite(group_id, user_id))
  # end

  defp build_invite(group_id, sender, recipient) do
    {token, hashed_token} = build_invite_token(@rand_size, @hash_algorithm)

    user = Users.get_by_identifier(recipient["identifier"]) || %{}

    attrs = %{
      group_id: group_id,
      sender_id: sender.id,
      recipient_id: Map.get(user, :id, nil),
      meta: recipient,
      context: "user",
      token: hashed_token,
      expiry: generate_expiry(1)
    }

    {token, GroupInvite.create_changeset(attrs)}
  end

  defp build_invite_token(size, algorithm) do
    token = :crypto.strong_rand_bytes(size)
    hashed_token = :crypto.hash(algorithm, token)

    {Base.url_encode64(token, padding: false), hashed_token}
  end

  defp generate_expiry(expiry_in_days) do
    DateTime.truncate(DateTime.add(DateTime.utc_now(), expiry_in_days, :day), :second)
  end

  def expired?(invite) do
    DateTime.utc_now() > invite.expiry
  end
end
