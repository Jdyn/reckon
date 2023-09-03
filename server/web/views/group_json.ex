defmodule Nimble.GroupJSON do
  alias Nimble.UserJSON

  @doc """
  Renders a list of groups.
  """
  def index(%{groups: groups}) do
    %{groups: for(group <- groups, do: external_group(group))}
  end

  @doc """
  Renders a single group.
  """
  def show(%{group: group}) do
    %{group: interal_group(group)}
  end

  def external_group(group) do
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
