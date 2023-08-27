defmodule Nimble.Groups.GroupInvites do
  @moduledoc false
  use Nimble.Web, :context

  alias Nimble.GroupInvite
  alias Nimble.Repo
  alias Nimble.User
  alias Nimble.Users

  # def deliver_group_invite_link(%Group{} = group, %User{} = user, sent_to) do
  #   {encoded_token, group_token} = GroupInvite.build_invite_token(group, user, sent_to)
  #   Repo.insert!(group_token)

  #   recipient = Users.get_by_identifier(sent_to)

  #   UserNotifier.deliver_group_invite_instructions(recipient, encoded_token)
  #   {:ok, encoded_token}
  # end

  def invite_member(group_id, sender, identifier) do
    with recipient = %User{} <- Users.get_by_identifier(identifier) do
      attrs = GroupInvite.build_invite(:existing_user, group_id, sender.id, recipient)

      %GroupInvite{}
      |> GroupInvite.existing_member_changeset(attrs)
      |> Repo.insert()
    end
  end

  def find_invites(user) do
    Repo.all(
      from(i in GroupInvite,
        where: i.recipient_id == ^user.id,
        left_join: g in assoc(i, :group),
        select: %{ i | group: g}
      )
    )
  end
end
