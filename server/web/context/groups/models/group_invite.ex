defmodule Nimble.GroupInvite do
  @moduledoc false
  use Nimble.Web, :model

  alias Nimble.Group
  alias Nimble.User

  # context: member, nonmember, mass

  schema "groups_invites" do
    field(:token, :string)
    field(:context, :string)
    field(:expiry, :utc_datetime)

    belongs_to(:sender, User)
    belongs_to(:group, Group)

    embeds_one(:recipient, Recipient) do
      field(:identifier, :string)
      field(:full_name, :string, default: nil)
    end

    timestamps(updated_at: false)
  end
end
