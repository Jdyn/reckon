defmodule Nimble.GroupInvite do
  @moduledoc false
  use Nimble.Web, :model

  alias Nimble.Group
  alias Nimble.GroupInvite
  alias Nimble.User

  # context: member, nonmember, mass

  schema "groups_invites" do
    field(:token, :string)
    field(:context, :string)
    field(:expiry, :utc_datetime)

    belongs_to(:sender, User)
    belongs_to(:group, Group, foreign_key: :group_id)

    belongs_to(:recipient, User, foreign_key: :recipient_id)

    embeds_one(:recipient_meta, Recipient) do
      field(:identifier, :string)
      field(:full_name, :string, default: nil)
    end

    timestamps(updated_at: false)
  end

  # create unique constraint on [user_id, group_id] to prevent duplicate invites
  def existing_member_changeset(%GroupInvite{} = invite, attrs) do
    invite
    |> cast(attrs, [:context, :group_id, :sender_id, :recipient_id])
    |> validate_required([:context, :group_id, :sender_id, :recipient_id])
    |> dbg()
    |> validate_inclusion(:context, ["existing_user", "nonexisting_user", "mass"])
    |> unique_constraint(:token)
    |> unique_constraint(:recipient,
      name: :no_duplicate_invites,
      message: "That user is currently already invited to the group."
    )
  end

  # def non_existing_member_changeset(%GroupInvite{} = invite, attrs) do
  #   invite
  #   |> cast(attrs, [:context])
  #   |> validate_required([:context])
  #   |> cast_embed(:recipient_meta, required: false, with: &recipient_meta_changeset/2)
  #   |> validate_inclusion(:context, ["member", "nonmember", "mass"])
  #   |> unique_constraint(:token)
  # end

  def recipient_meta_changeset(recipient, attrs \\ %{}) do
    recipient
    |> cast(attrs, [:identifier, :full_name])
    |> User.validate_identifier()
    |> validate_required([:identifier])
  end

  def build_invite(type, group_id, sender_id, recipient, expiry_in_days \\ 7)

  def build_invite(:existing_user, group_id, sender_id, recipient, expiry_in_days) do
    %{
      group_id: group_id,
      sender_id: sender_id,
      recipient_id: recipient.id,
      recipient_meta: nil,
      context: "existing_user",
      expiry: DateTime.add(DateTime.utc_now(), expiry_in_days, :day)
    }
  end

  def build_invite(:nonexisting_user, group_id, sender_id, recipient, expiry_in_days) do
    %{
      group_id: group_id,
      sender_id: sender_id,
      recipient_meta: %{
        identifier: recipient.identifier,
        full_name: recipient.full_name
      },
      context: "nonexisting_user",
      expiry: DateTime.add(DateTime.utc_now(), expiry_in_days, :day)
    }
  end
end
