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

      iex> invite(group_id, sender, recipient)
      {:ok, %GroupInvite{}}

  """
  def invite(group_id, sender_id, %{"recipient" => recipient}) do
    with invite = %GroupInvite{} <- find_invite(group_id, recipient["identifier"]) do
      # TODO: Resend the email or text message

      if expired?(invite) do
        delete_invite!(invite)
        {:error, "The invite has expired! Please request a new one."}
      else
        {:ok, "An invite has been resent!"}
      end
    else
      nil ->
        # An invite does not already exist
        case Users.get_by_identifier(recipient["identifier"]) do
          %User{} = user ->
            {_token, attrs} =
              build_invite(group_id, sender_id, %{
                recipient_id: user.id,
                meta: recipient,
                context: "user"
              })

            Repo.insert(GroupInvite.user_changeset(attrs))
            {:ok, "An invite has been sent!"}

          nil ->
            {_token, attrs} =
              build_invite(group_id, sender_id, %{
                meta: recipient,
                context: "nonuser"
              })

            Repo.insert(GroupInvite.nonuser_changeset(attrs))
            {:ok, "An invite has been sent!"}
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

  def delete_invite!(invite) do
    Repo.delete!(invite)
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

  def expired?(invite) do
    DateTime.utc_now() > invite.expiry
  end
end
