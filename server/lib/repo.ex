defmodule Nimble.Repo do
  use Ecto.Repo,
    otp_app: :nimble,
    adapter: Ecto.Adapters.Postgres

  defmacro __using__(_opts) do
    quote do
      import Ecto.Changeset
      import Ecto.Query

      alias Ecto.Changeset
      alias Nimble.Repo

      require Ecto.Query

      defguard is_id(x) when is_binary(x) or is_integer(x)

      defp stringize_params(params) do
        case Enum.at(params, 0) do
          {k, _} when is_atom(k) ->
            Map.new(params, fn {k, v} -> {to_string(k), v} end)

          _ ->
            params
        end
      end

      defp transaction_with_rescue(fun) do
        Repo.transaction(fn ->
          try do
            fun.()
          rescue
            e in Ecto.InvalidChangesetError -> Repo.rollback(e.changeset)
          end
        end)
      end
    end
  end
end
