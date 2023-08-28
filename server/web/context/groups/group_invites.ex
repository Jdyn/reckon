defmodule Nimble.Groups.GroupInvites do
  @moduledoc false
  use Nimble.Web, :context

  alias Nimble.Accounts.Users
  alias Nimble.GroupInvite
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
      with %{"identifier" => identifier} <- recipient,
           user = %User{} <- Users.get_by_identifier(identifier) do
        attrs = GroupInvite.build_invite(:existing_user, group_id, sender.id, user)
        GroupInvite.existing_user_changeset(%GroupInvite{}, attrs)
      else
        nil ->
          attrs = GroupInvite.build_invite(:non_existing_user, group_id, sender.id, recipient)
          GroupInvite.non_existing_user_changeset(%GroupInvite{}, attrs)
      end

    with {:ok, _invite} <- Repo.insert(changeset) do
      # TODO: discern between existing and non-existing user and send
      # the appropriate email or text message depending on
      # What field the user was invited by
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
