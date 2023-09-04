defmodule Nimble.Groups.GroupInvites do
  @moduledoc false
  use Nimble.Web, :context

  alias Nimble.Accounts.Users
  alias Nimble.GroupInvite
  alias Nimble.Groups
  alias Nimble.Groups.Query
  alias Nimble.Repo
  alias Nimble.User

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

      iex> invite_member(group_id, sender, recipient)
      {:ok, %GroupInvite{}}

  """
  def invite_member(group_id, sender_id, %{"context" => "user"} = params) do
    %{"recipient" => %{"identifier" => identifier}} = params

    with user = %User{} <- Users.get_by_identifier(identifier) do
      {_token, attrs} =
        build_invite(group_id, sender_id, %{
          recipient_id: user.id,
          recipient_meta: params["recipient"],
          context: "user"
        })

      Repo.insert(GroupInvite.user_changeset(attrs))
    else
      nil ->
        {:error, "Hm, that didn't work. Double check that the information is correct."}
    end
  end

  def invite_member(group_id, sender_id, %{"context" => "nonuser"} = params) do
    {_token, attrs} = build_invite(group_id, sender_id, %{recipient_meta: params["recipient"], context: "nonuser"})
    Repo.insert(GroupInvite.nonuser_changeset(attrs))
  end

  def accept_invite(group_id, user_id) do
    with %GroupInvite{} = invite <- Repo.one(Query.group_invite(group_id, user_id)),
         {:ok, _member} <- Groups.add_member(group_id, user_id) do
      Repo.delete!(invite)

      {:ok, Groups.get_group!(group_id)}
    else
      _ ->
        {:error, "Invite not found."}
    end
  end

  @doc """
  Returns a list of all invites sent to a user.

  ## Examples

      iex> find_invites(user)
      [%GroupInvite{}, ...]
  """
  def find_invites(user) do
    Repo.all(Query.invites_for_user(user.id))
  end

  defp build_invite(group_id, sender_id, attrs, expiry_in_days \\ 7) do
    {token, hashed_token} = build_invite_token(@rand_size, @hash_algorithm)

    {token,
     Map.merge(attrs, %{
       token: hashed_token,
       group_id: group_id,
       sender_id: sender_id,
       expiry: generate_expiry(expiry_in_days)
     })}
  end

  defp build_invite_token(size, algorithm) do
    token = :crypto.strong_rand_bytes(size)
    hashed_token = :crypto.hash(algorithm, token)

    {Base.url_encode64(token, padding: false), hashed_token}
  end

  defp generate_expiry(expiry_in_days) do
    DateTime.truncate(DateTime.add(DateTime.utc_now(), expiry_in_days, :day), :second)
  end
end
