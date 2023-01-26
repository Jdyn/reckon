defmodule Reckon.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Reckon.Repo,
      # Start the Telemetry supervisor
      Reckon.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Reckon.PubSub},
      # Start the Endpoint (http/https)
      Reckon.Endpoint,
      # Start a worker by calling: Reckon.Worker.start_link(arg)
      # {Reckon.Worker, arg}
      con_cache_child(:user_cache, 5),
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Reckon.Supervisor]
    Supervisor.start_link(children, opts)
  end

  defp con_cache_child(name, global_ttl) do
    Supervisor.child_spec(
      {
        ConCache,
        [
          name: name,
          ttl_check_interval: :timer.seconds(10),
          global_ttl: :timer.minutes(global_ttl)
        ]
      },
      id: {ConCache, name}
    )
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    Reckon.Endpoint.config_change(changed, removed)
    :ok
  end
end
