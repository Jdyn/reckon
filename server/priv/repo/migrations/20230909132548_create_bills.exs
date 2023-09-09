defmodule Nimble.Repo.Migrations.CreateBills do
  use Ecto.Migration

  def change do
    create table(:bills) do
      add(:description, :text)
      add(:total, :money)

      add(:split, :string, default: "evenly")
      add(:status, :string)

      add(:options, :map)

      add(:group_id, references(:groups, on_delete: :nothing))
      add(:user_ledger_id, references(:users_ledgers, on_delete: :nothing))

      timestamps()
    end

    create table(:bills_charges) do
      add(:amount, :money)
      add(:split_percent, :decimal)
      add(:accepted, :boolean, default: false)
      add(:payment_status, :string, default: "uncharged")

      add(:bill_id, references(:bills, on_delete: :nothing))
      add(:user_ledger_id, references(:users_ledgers, on_delete: :nothing))

      timestamps()
    end

    create table(:bills_items) do
      add(:description, :text)
      add(:notes, :text)
      add(:cost, :money)

      add(:bill_id, references(:bills, on_delete: :nothing))

      timestamps()
    end
  end
end
