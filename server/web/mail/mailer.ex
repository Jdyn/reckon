defmodule Reckon.Mailer do
  use Swoosh.Mailer, otp_app: :reckon, adapter: Swoosh.Adapters.Local
end
