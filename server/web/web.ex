defmodule Nimble.Web do
  @moduledoc false

  def model do
    quote do
      use Ecto.Schema

      import Ecto
      import Ecto.Changeset
      import Ecto.Multi
      import Ecto.Query

      @timestamps_opts [type: :utc_datetime]
    end
  end

  def controller do
    quote do
      use Phoenix.Controller, namespace: Nimble, formats: [:json]

      import Ecto.Query
      import Plug.Conn

      def current_user(conn), do: conn.assigns[:current_user]

      unquote(verified_routes())
    end
  end

  def context do
    quote do
      use Ecto.Schema

      import Ecto
      import Ecto.Changeset
      import Ecto.Multi
      import Ecto.Query
    end
  end

  def router do
    quote do
      use Phoenix.Router
    end
  end

  def channel do
    quote do
      use Phoenix.Channel
    end
  end

  def verified_routes do
    quote do
      use Phoenix.VerifiedRoutes,
        endpoint: Nimble.Endpoint,
        router: Nimble.Router,
        statics: []
    end
  end

  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
