defmodule Reckon.Repo.Migrations.CreateExtensions do
  use Ecto.Migration

  def up do
    execute("CREATE EXTENSION IF NOT EXISTS citext")
    execute("CREATE EXTENSION pg_trgm")
    execute("CREATE EXTENSION fuzzystrmatch")
  end

  def down do
    execute("DROP EXTENSION fuzzystrmatch")
    execute("DROP EXTENSION pg_trgm")
    execute("DROP EXTENSION citext")
  end
end
