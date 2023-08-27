defmodule Nimble.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add(:email, :string)
      add(:phone, :string)
      add(:username, :string)
      add(:full_name, :string)
      add(:avatar, :string)

      add(:password_hash, :string, null: true)
      add(:confirmed_at, :naive_datetime)

      add(:is_admin, :boolean, default: false, null: false)

      timestamps()
    end

    create(constraint(:users, :ensure_email_or_phone_or_username, check: "num_nulls(email, phone, username) = 2"))
    create unique_index(:users, [:email])
    create unique_index(:users, [:phone])

  end
end
