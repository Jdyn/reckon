defmodule Reckon.Auth.OAuth do
  alias Assent.Config

  def request(provider) do
    if config = config(provider) do
      config = Config.put(config, :redirect_uri, build_uri(provider))
      config[:strategy].authorize_url(config)
    else
      {:not_found, "No provider configuration for #{provider}"}
    end
  end

  def callback(provider, params, session_params \\ %{}) do
    if config = config(provider) do
      config =
        Config.put(config, :session_params, session_params)
        |> Config.put(:redirect_uri, build_uri(provider))

      config[:strategy].callback(config, params)
    else
      {:not_found, "Invalid callback"}
    end
  end

  defp config(provider) do
    try do
      Application.get_env(:reckon, :strategies)[String.to_existing_atom(provider)]
    rescue
      ArgumentError ->
        nil
    end
  end

  defp build_uri(provider) do
    "#{Reckon.Endpoint.url()}/api/account/#{provider}/callback"
  end
end
