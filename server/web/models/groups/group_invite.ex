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

    embeds_one(:recipient_meta, Recipient, primary_key: false) do
      field(:identifier, :string)
      field(:full_name, :string, default: nil)
      field(:email, :string, virtual: true)
      field(:phone, :string, virtual: true)
    end

    timestamps(updated_at: false)
  end

  def base_changeset(%GroupInvite{} = invite, attrs \\ %{}) do
    invite
    |> cast(attrs, [:context, :group_id, :sender_id, :expiry])
    |> validate_required([:context, :group_id, :sender_id, :expiry])
    |> validate_inclusion(:context, ["existing_user", "non_existing_user", "mass"])
    |> unique_constraint(:token)
  end

  # create unique constraint on [user_id, group_id] to prevent duplicate invites
  def existing_user_changeset(%GroupInvite{} = invite, attrs) do
    invite
    |> base_changeset(attrs)
    |> cast(attrs, [:recipient_id])
    |> validate_required(:recipient_id)
    |> unique_constraint(:recipient,
      name: :no_duplicate_invites,
      message: "That user is currently already invited to the group."
    )
  end

  def non_existing_user_changeset(%GroupInvite{} = invite, attrs) do
    invite
    |> base_changeset(attrs)
    |> cast_embed(:recipient_meta, required: true, with: &recipient_meta_changeset/2)
  end

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

  def build_invite(:non_existing_user, group_id, sender_id, recipient, expiry_in_days) do
    %{
      group_id: group_id,
      sender_id: sender_id,
      recipient_meta: %{
        identifier: recipient["identifier"],
        full_name: recipient["full_name"]
      },
      context: "non_existing_user",
      expiry: DateTime.add(DateTime.utc_now(), expiry_in_days, :day)
    }
  end
end
