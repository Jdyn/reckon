defmodule Nimble.Repo.Migrations.CreateLikes do
  use Ecto.Migration

  def change do
    create table(:users_likes) do
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :bill_id, references(:bills, on_delete: :delete_all), null: false

      timestamps()
    end
  end
end
