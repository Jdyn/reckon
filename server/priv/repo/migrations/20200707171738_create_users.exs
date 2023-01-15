defmodule Reckon.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add(:email, :citext, null: false)
      add(:username, :citext, null: false)
      add(:first_name, :string)
      add(:last_name, :string)
      add(:avatar, :string)
      add(:phone, :string)

      add(:password_hash, :string, null: true)

      add(:confirmed_at, :naive_datetime)
      add(:is_admin, :boolean, default: false, null: false)

      timestamps()
    end

    create(unique_index(:users, [:email]))
    create(unique_index(:users, [:username]))

  end
end
