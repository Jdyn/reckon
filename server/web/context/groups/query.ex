defmodule Nimble.Groups.Query do
  @moduledoc false
  use Nimble.Web, :context

  alias Nimble.Group
  alias Nimble.GroupInvite
  alias Nimble.GroupMember
  alias Nimble.User

  def group_member(group_id, user_id) do
    from(m in GroupMember,
      where: m.group_id == ^group_id and m.user_id == ^user_id,
      select: m
    )
  end

  def group_for_member(group_id, user_id) do
    from(gm in GroupMember,
      where: gm.user_id == ^user_id and gm.group_id == ^group_id,
      join: g in assoc(gm, :group),
        join: c in assoc(g, :creator),
      select: %{g | creator: c}
    )
  end

  def groups_for_member(user_id) do
    from(m in GroupMember,
      where: m.user_id == ^user_id,
      join: g in Group,
      on: m.group_id == g.id,
      join: u in User,
      on: g.creator_id == u.id,
      select: %{g | creator: u}
    )
  end

  def group_invite_for_user(group_id, user_id) do
    from(i in GroupInvite,
      where: i.group_id == ^group_id and i.recipient_id == ^user_id,
      select: i
    )
  end
end
