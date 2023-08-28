defmodule Nimble.GroupJSON do

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
    }
  end

  def invites(%{invites: invites}) do
    %{
      invites: for(invite <- invites, do: user_invite(invite))
    }
  end

  def user_invite(invite) do
    %{
      id: invite.id,
      recipient_id: invite.recipient_id,
      group: group(invite.group),
    }
  end
end
