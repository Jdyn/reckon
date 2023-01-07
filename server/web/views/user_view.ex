defmodule Reckon.UserView do
  use Reckon.Web, :view

  alias Reckon.{UserView, UserTokenView}

  def render("show.json", %{user: user}) do
    %{
      user: render_one(user, UserView, "user.json", as: :user)
    }
  end

  def render("login.json", %{user: user}) do
    %{
      user: render_one(user, UserView, "user.json", as: :user)
    }
  end

  def render("ok.json", _) do
    %{}
  end

  def render("user.json", %{user: user}) do
    %{
      id: user.id,
      firstName: user.first_name,
      email: user.email,
      confirmedAt: user.confirmed_at,
      isAdmin: user.is_admin
    }
  end

  def render("sessions.json", %{tokens: tokens}) do
    %{
      tokens: render_many(tokens, UserTokenView, "token.json", as: :token)
    }
  end

  def render("session.json", %{token: token}) do
    %{
      token: render_one(token, UserTokenView, "token.json", as: :token)
    }
  end

  def render("get_provider.json", %{url: url}) do
    %{
      url: url
    }
  end
end
