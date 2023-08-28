defmodule Nimble.Repo.Migrations.CreateEdicts do
  use Ecto.Migration

  def change do
    create table(:edicts) do
      add(:description, :text)
      add(:amount, :money_with_currency)

      timestamps()
    end
  end
end
