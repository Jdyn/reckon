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
    belongs_to(:group, Group)

    belongs_to(:recipient, User, foreign_key: :recipient_id)

    embeds_one(:meta, GroupInviteMeta, primary_key: false) do
      field(:identifier, :string)
      field(:full_name, :string, default: nil)

      field(:email, :string, virtual: true)
      field(:phone, :string, virtual: true)
    end

    timestamps(updated_at: false)
  end

  def create_changeset(attrs) do
    %GroupInvite{}
    |> cast(attrs, [:token, :context, :sender_id, :group_id, :recipient_id])
    |> put_change(:expiry, generate_expiry(1))
    |> validate_required([:context, :group_id, :sender_id, :expiry])
    |> validate_inclusion(:context, ["user", "nonuser", "mass"])
    |> cast_embed(:meta, required: true, with: &meta_changeset/2)
    |> validate_self_refferential()
    |> unique_constraint(:token)
    |> unique_constraint(:recipient,
      name: :no_duplicate_invites,
      message: "User is already invited to the group."
    )
  end

  def meta_changeset(recipient, attrs \\ %{}) do
    recipient
    |> cast(attrs, [:identifier, :full_name])
    |> User.validate_identifier()
    |> validate_required([:identifier])
  end

  defp validate_self_refferential(changeset) do
    sender_id = get_change(changeset, :sender_id)
    recipient_id = get_change(changeset, :recipient_id)
    group_id = get_change(changeset, :group_id)
    %{identifier: identifier} = get_embed(changeset, :meta, :struct)

    cond do
      recipient_id == sender_id ->
        add_error(changeset, :identifier, "Cannot invite yourself to a group.")

      Nimble.Groups.is_member?(group_id, identifier: identifier) == true ->
        add_error(changeset, :identifier, "User is already a member.")

      true ->
        changeset
    end
  end

  defp generate_expiry(expiry_in_days) do
    DateTime.truncate(DateTime.add(DateTime.utc_now(), expiry_in_days, :day), :second)
  end
end
