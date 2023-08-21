defmodule Nimble.Groups.Query do
  @moduledoc false
  use Nimble.Web, :context

  alias Nimble.GroupMember
  alias Nimble.User
  alias Nimble.Group

  def find_group_member(group_id, user_id) do
    from(m in GroupMember,
      where: m.group_id == ^group_id and m.user_id == ^user_id,
      select: m
    )
  end

  def groups_for_member(user_id) do
    from(m in GroupMember,
      where: m.user_id == ^user_id,
      join: g in Group, on: m.group_id == g.id,
      join: u in User, on: g.creator_id == u.id,
      select: %{g | creator: u}
    )
  end
end
