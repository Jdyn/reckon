defmodule Nimble.Endpoint do
  use Phoenix.Endpoint, otp_app: :nimble

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  @session_options [
    store: :cookie,
    key: "session_id",
    signing_salt: "AwA3CM4V",
    same_site: "none",
    secure: true
  ]

  socket("/socket", Nimble.Accounts.Usersocket,
    websocket: true,
    longpoll: false
  )

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    plug(Phoenix.CodeReloader)
    plug(Phoenix.Ecto.CheckRepoStatus, otp_app: :nimble)
  end

  plug(Plug.RequestId)

  plug(Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()
  )

  plug(CORSPlug, origin: ["http://localhost:3000"])

  plug(Plug.MethodOverride)
  plug(Plug.Head)
  plug(Plug.Session, @session_options)
  plug(Nimble.Router)
end
