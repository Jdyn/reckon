defmodule Nimble.SessionJSON do
  alias Nimble.UserJSON

  def index(%{tokens: tokens}) do
    %{
      sessions: for(token <- tokens, do: UserJSON.token(token))
    }
  end

  def show(%{token: token}) do
    %{
      session: UserJSON.token(token)
    }
  end
end
