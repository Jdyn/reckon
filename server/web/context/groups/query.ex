defmodule Nimble.Groups.Query do
  @moduledoc false
  use Nimble.Web, :context

  alias Nimble.GroupInvite
  alias Nimble.GroupMember

  def group_member(group_id, identifier: identifier) do
    from(m in GroupMember,
      left_join: u in assoc(m, :user),
      where: m.group_id == ^group_id,
      where: u.email == ^identifier or u.phone == ^identifier
    )
  end

  def group_member(group_id, user_id) do
    from(m in GroupMember,
      where: m.group_id == ^group_id and m.user_id == ^user_id
    )
  end

  def group_for_member(group_id, user_id) do
    from(member in GroupMember,
      where:
        member.user_id == ^user_id and
          member.group_id == ^group_id,
      join: group in assoc(member, :group),
      select: group
    )
  end

  def groups_for_member(user_id) do
    from(m in GroupMember,
      where: m.user_id == ^user_id,
      join: g in assoc(m, :group),
      select: g
    )
  end

  def group_invite(group_id, user_id) do
    from(i in GroupInvite,
      where: i.group_id == ^group_id and i.recipient_id == ^user_id
    )
  end

  def group_invites(group_id) do
    from(i in GroupInvite,
      where: i.group_id == ^group_id
    )
  end
end
