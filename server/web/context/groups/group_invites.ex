defmodule Nimble.Groups.GroupInvites do
  @moduledoc false
  use Nimble.Web, :context

  alias Nimble.Accounts.Users
  alias Nimble.GroupInvite
  alias Nimble.Groups
  alias Nimble.Groups.Query
  alias Nimble.Repo
  alias Nimble.User

  # def deliver_group_invite_link(%Group{} = group, %User{} = user, sent_to) do
  #   {encoded_token, group_token} = GroupInvite.build_invite_token(group, user, sent_to)
  #   Repo.insert!(group_token)

  #   recipient = Users.get_by_identifier(sent_to)

  #   UserNotifier.deliver_group_invite_instructions(recipient, encoded_token)
  #   {:ok, encoded_token}
  # end

  @doc """
  Invites an existing user to a group, or sends an invite to a non-existing user.

  ## Examples

      iex> invite_member(group_id, sender, recipient)
      {:ok, %GroupInvite{}}

  """
  def invite_member(group_id, sender, recipient) do
    changeset =
      with user = %User{} <- Users.get_by_identifier(recipient["identifier"]) do
        :existing_user
        |> GroupInvite.build_invite(group_id, sender.id, user)
        |> GroupInvite.existing_user_changeset()
      else
        nil ->
          :non_existing_user
          |> GroupInvite.build_invite(group_id, sender.id, recipient)
          |> GroupInvite.non_existing_user_changeset()
      end

    with {:ok, _invite} <- Repo.insert(changeset) do
      # TODO: discern between existing and non-existing user and send
      # the appropriate email or text message depending on
      # What field the user was invited by
    end
  end

  def accept_invite(group_id, user_id) do
    with %GroupInvite{} = invite <- Repo.one(Query.group_invite_for_user(group_id, user_id)),
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
    Repo.all(
      from(i in GroupInvite,
        where: i.recipient_id == ^user.id,
        left_join: g in assoc(i, :group),
        select: %{i | group: g}
      )
    )
  end
end
