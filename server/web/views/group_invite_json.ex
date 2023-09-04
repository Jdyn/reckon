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
      recipient_meta: recipient_meta(invite.recipient_meta)
    }
  end

  defp recipient_meta(recipient_meta) do
    %{
      identifier: recipient_meta.identifier,
      full_name: recipient_meta.full_name
    }
  end
end
