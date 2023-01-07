defmodule Reckon.MixProject do
  use Mix.Project

  def project do
    [
      app: :reckon,
      version: "0.1.0",
      elixir: "~> 1.14.0",
      elixirc_paths: elixirc_paths(Mix.env()),
      compilers: [:phoenix] ++ Mix.compilers(),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  # Configuration for the OTP application.
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {Reckon.Application, []},
      extra_applications: [:logger, :runtime_tools, :inets]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_), do: ["lib", "web"]

  # Specifies your project dependencies.
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:phoenix, "~> 1.6.12"},
      {:phoenix_ecto, "~> 4.4.0"},
      {:ecto_sql, "~> 3.8.3"},
      {:postgrex, "~> 0.16.4"},
      {:swoosh, "~> 1.8"},
      {:assent, "~> 0.2.1"},
      {:telemetry_metrics, "~> 0.4.0"},
      {:telemetry_poller, "~> 0.4.0"},
      {:jason, "~> 1.4.0"},
      {:cors_plug, "~> 3.0.3"},
      {:pbkdf2_elixir, "~> 2.0.0"},
      {:plug_cowboy, "~> 2.5.2"}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to install project dependencies and perform other setup tasks, run:
  #
  #     $ mix setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      setup: ["deps.get", "ecto.setup"],
      "ecto.setup": ["ecto.create", "ecto.migrate"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test"]
    ]
  end
end
