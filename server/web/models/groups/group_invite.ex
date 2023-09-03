defmodule Nimble.GroupInvite do
  @moduledoc false
  use Nimble.Web, :model

  alias Nimble.Group
  alias Nimble.GroupInvite
  alias Nimble.User

  # context: user, nonuser, mass

  schema "groups_invites" do
    field(:token, :binary)
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

  def base_changeset(%GroupInvite{} = invite, attrs) do
    invite
    |> cast(attrs, [:token, :context, :expiry, :sender_id, :group_id, :recipient_id])
    |> validate_required([:context, :group_id, :sender_id, :expiry])
    |> validate_inclusion(:context, ["user", "nonuser", "mass"])
    |> cast_embed(:recipient_meta, required: true, with: &recipient_meta_changeset/2)
    |> validate_self_refferential()
    |> unique_constraint(:token)
  end

  # create unique constraint on [user_id, group_id] to prevent duplicate invites
  def user_changeset(attrs) do
    %GroupInvite{}
    |> base_changeset(attrs)
    |> validate_required(:recipient_id)
    |> unique_constraint(:recipient,
      name: :no_duplicate_invites,
      message: "That user is currently already invited to the group."
    )
  end

  def nonuser_changeset(attrs) do
    base_changeset(%GroupInvite{}, attrs)
  end

  def recipient_meta_changeset(recipient, attrs \\ %{}) do
    recipient
    |> cast(attrs, [:identifier, :full_name])
    |> User.validate_identifier()
    |> validate_required([:identifier])
  end

  defp validate_self_refferential(changeset) do
    sender_id = get_change(changeset, :sender_id)
    recipient_id = get_change(changeset, :recipient_id)
    group_id = get_change(changeset, :group_id)
    %{identifier: identifier} = get_embed(changeset, :recipient_meta, :struct)

    cond do
      recipient_id == sender_id ->
        add_error(changeset, :identifier, "You can't invite yourself to a group.")

      Nimble.Groups.is_member?(group_id, identifier: identifier) == true ->
        add_error(changeset, :identifier, "That user is already a member of the group.")

      true ->
        changeset
    end
  end
end
