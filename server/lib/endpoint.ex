defmodule Reckon.Endpoint do
  use Phoenix.Endpoint, otp_app: :reckon

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  @session_options [
    store: :cookie,
    key: "session_id",
    signing_salt: "AwA3CM4V"
  ]

  socket("/socket", Reckon.UserSocket,
    websocket: true,
    longpoll: false
  )

  # socket("/live", Phoenix.LiveView.Socket, websocket: [connect_info: [session: @session_options]])

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    plug(Phoenix.CodeReloader)
    plug(Phoenix.Ecto.CheckRepoStatus, otp_app: :reckon)
  end

  # plug(Phoenix.LiveDashboard.RequestLogger,
  #   param_key: "request_logger",
  #   cookie_key: "request_logger"
  # )

  plug(Plug.RequestId)
  plug(Plug.Telemetry, event_prefix: [:phoenix, :endpoint])

  plug(Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()
  )

  plug(CORSPlug, origin: ["http://localhost:3000", "http://127.0.0.1:8002"])

  plug(Plug.MethodOverride)
  plug(Plug.Head)
  plug(Plug.Session, @session_options)
  plug(Reckon.Router)
end
