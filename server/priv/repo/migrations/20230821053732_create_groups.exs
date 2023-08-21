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
  end
end
