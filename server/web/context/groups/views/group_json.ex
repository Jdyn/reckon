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

  def invite(invite) do
    %{
      id: invite.id,
      recipient: %{
        identifier: invite.recipient.identifier,
        full_name: invite.recipient.full_name,
      },
      group_id: invite.group_id,
    }
  end
end
