defmodule Nimble.SessionJSON do
  alias Nimble.UserTokenJSON

  def sessions(%{tokens: tokens}) do
    %{
      sessions: for(token <- tokens, do: UserTokenJSON.token(token))
    }
  end

  def session(%{token: token}) do
    %{
      session: UserTokenJSON.token(token)
    }
  end
end
