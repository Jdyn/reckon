defmodule Nimble.Repo.Migrations.CreateGroups do
  use Ecto.Migration

  def change do
    create table(:groups) do
      add(:name, :string)
      add(:creator_id, references(:users, on_delete: :delete_all), null: false)

      timestamps()
    end

    create table(:groups_members) do
      add(:group_id, references(:groups, on_delete: :delete_all), null: false)
      add(:user_id, references(:users, on_delete: :delete_all), null: false)

      timestamps()
    end

    create unique_index(:groups_members, [:group_id, :user_id], name: :no_duplicate_members)

    create table(:groups_invites) do
      add(:token, :binary)
      add(:context, :string)
      add(:expiry, :utc_datetime)

      add(:sender_id, references(:users, on_delete: :delete_all), null: false)
      add(:group_id, references(:groups, on_delete: :delete_all), null: false)

      add(:recipient_id, references(:users, on_delete: :delete_all), null: true)
      add(:meta, :map, null: false)

      timestamps(updated_at: false)
    end

    create unique_index(:groups_invites, [:group_id, :recipient_id], name: :no_duplicate_invites)
  end
end
