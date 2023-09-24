defmodule Nimble.Cldr do
  @moduledoc """
  Define a backend module that will host the
  Cldr configuration and public API.

  Most function calls in Cldr will be calls
  to functions on this module.
  """
  use Cldr,
    default_locale: "en",
    locales: ["en"],
    otp_app: :nimble,
    providers: [Cldr.Number, Money]
end
