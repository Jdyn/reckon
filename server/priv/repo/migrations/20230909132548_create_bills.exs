defmodule Nimble.Repo.Migrations.CreateBills do
  use Ecto.Migration

  def change do
    create table(:bills_categories) do
      add(:name, :string)
      add(:color, :string)

      add(:group_id, references(:groups, on_delete: :delete_all))

      timestamps()
    end

    create table(:bills) do
      add(:description, :text)
      add(:type, :string)
      add(:total, :money_with_currency)

      add(:status, :string)
      add(:options, :map)

      add(:like_count, :integer, default: 0)

      add(:group_id, references(:groups, on_delete: :nilify_all))
      add(:category_id, references(:bills_categories, on_delete: :nilify_all))
      add(:creator_id, references(:users, on_delete: :nothing))

      timestamps()
    end

    create unique_index(:bills_categories, [:name, :group_id], name: :no_duplicate_categories)

    create table(:bills_charges) do
      add(:amount, :money_with_currency)
      add(:split_percent, :decimal)
      add(:approval_status, :string, default: "pending")
      add(:payment_status, :string, default: "uncharged")

      add(:bill_id, references(:bills, on_delete: :delete_all))
      add(:user_id, references(:users, on_delete: :nilify_all))

      timestamps()
    end

    create unique_index(:bills_charges, [:user_id, :bill_id], name: :no_duplicate_charges)

    create table(:bills_items) do
      add(:description, :text)
      add(:notes, :text)
      add(:cost, :money_with_currency)

      add(:bill_id, references(:bills, on_delete: :nothing))

      timestamps()
    end
  end
end
