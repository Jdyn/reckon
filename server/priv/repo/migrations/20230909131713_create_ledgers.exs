defmodule Nimble.Repo.Migrations.CreateLedgers do
  use Ecto.Migration

  def change do
    create table(:users_ledgers) do
      add(:balance, :money_with_currency)
      add(:user_id, references(:users, on_delete: :nothing))
      timestamps()
    end

  end
end
