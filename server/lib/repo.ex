defmodule Reckon.Repo do
  use Ecto.Repo,
    otp_app: :reckon,
    adapter: Ecto.Adapters.Postgres
end
