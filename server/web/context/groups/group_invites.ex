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
  def invite_member(group_id, sender_id, %{"recipient" => %{"identifier" => identifier}} = params) do
    with invite = %GroupInvite{} <- find_invite(group_id, identifier),
        false <- expired?(invite.expiry) do
      # TODO: Resend the email or text message
      {:ok, "An invite has been resent!"}

    else
      nil ->
        # The invite does not exist
        case Users.get_by_identifier(identifier) do

        end
      false ->
        # The invite is expired
        nil
    end



    case Users.get_by_identifier(identifier) do
      %User{} = user ->
        {_token, attrs} =
          build_invite(group_id, sender_id, %{
            recipient_id: user.id,
            recipient_meta: params["recipient"],
            context: "user"
          })

        invite = Repo.insert(GroupInvite.user_changeset(attrs))
        {:ok, {:user, invite}}

      nil ->
        case find_invite(identifier, group_id) do
          %GroupInvite{} = invite ->

          nil ->
            {_token, attrs} =
              build_invite(group_id, sender_id, %{
                recipient_meta: params["recipient"],
                context: "nonuser"
              })

            invite = Repo.insert(GroupInvite.nonuser_changeset(attrs))
            dbg(invite)

            {:ok, {:nonuser, invite}}
        end
    end
  end

  def accept_invite(group_id, user_id) do
    with %GroupInvite{} = invite <- Repo.one(Query.group_invite(group_id, user_id)),
         {:ok, _member} <- Groups.add_member(group_id, user_id) do
      Repo.delete!(invite)
      :ok
    else
      _ ->
        :error
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

  def find_invite(group_id, identifier) do
    Repo.one(Query.group_invite_from_identifier(group_id, identifier))
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

  def expired?(invite.expiry) do
    DateTime.utc_now() > invite.expiry
  end
end
