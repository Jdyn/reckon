defmodule Nimble.GroupJSON do
  alias Nimble.UserJSON

  @doc """
  Renders a list of groups.
  """
  def index(%{groups: groups}) do
    %{groups: for(group <- groups, do: group(group))}
  end

  @doc """
  Renders a single group.
  """
  def show(%{group: group}) do
    %{group: group(group)}
  end

  def group(group) do
    %{
      id: group.id,
      name: group.name,
      creator: UserJSON.user(group.creator),
    }
  end
end
