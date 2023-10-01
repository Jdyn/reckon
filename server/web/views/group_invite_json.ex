defmodule Nimble.GroupInviteJSON do

  alias Nimble.GroupJSON
  alias Nimble.GroupInvite
  alias Nimble.UserJSON

  def index(%{invites: invites}) do
    for(invite <- invites, do: group_invite(invite))
  end

  def group_invite(invite = %GroupInvite{}) do
    %{
      id: invite.id,
      meta: meta(invite.meta),
      sender: UserJSON.external_user(invite.sender),
      group: GroupJSON.external_group(invite.group)
    }
  end

  defp meta(meta) do
    %{
      identifier: meta.identifier,
      full_name: meta.full_name
    }
  end
end
