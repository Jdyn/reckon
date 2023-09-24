defmodule Nimble.GroupInviteJSON do
  def index(%{invites: invites}) do
    %{
      invites: for(invite <- invites, do: group_invite(invite))
    }
  end

  def group_invite(invite) do
    %{
      id: invite.id,
      group_id: invite.group_id,
      meta: meta(invite.meta)
    }
  end

  defp meta(meta) do
    %{
      identifier: meta.identifier,
      full_name: meta.full_name
    }
  end
end
