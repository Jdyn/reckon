defmodule Nimble.SessionJSON do
  alias Nimble.UserJSON

  def index(%{tokens: tokens}) do
    for(token <- tokens, do: UserJSON.token(token))
  end

  def show(%{token: token}) do
    UserJSON.token(token)
  end
end
