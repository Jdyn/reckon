defmodule Nimble.GroupJSON do
  alias Nimble.Group
  alias Nimble.UserJSON

  @doc """
  Renders a list of groups.
  """
  def index(%{groups: groups}) do
    for(group <- groups, do: external_group(group))
  end

  @doc """
  Renders a single group.
  """
  def show(%{group: group}) do
    interal_group(group)
  end

  def external_group(nil), do: nil

  def external_group(%Group{} = group) do
    %{
      id: group.id,
      name: group.name
    }
  end

  def interal_group(group) do
    %{
      id: group.id,
      name: group.name,
      creator: UserJSON.user(group.creator),
      members:
        for(
          member <- group.members,
          do: %{
            id: member.id,
            full_name: member.full_name,
            email: member.email
          }
        )
    }
  end
end
