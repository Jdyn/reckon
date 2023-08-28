defmodule Nimble.UserJSON do
  alias Nimble.GroupJSON
  alias Nimble.User
  alias Nimble.UserToken

  def show(%{user: user}) do
    %{
      user: user(user)
    }
  end

  def get_provider(%{url: url}) do
    %{
      url: url
    }
  end

  def user(%User{} = user) do
    %{
      id: user.id,
      fullName: user.full_name,
      username: user.username,
      phone: user.phone,
      email: user.email,
      confirmedAt: user.confirmed_at,
      isAdmin: user.is_admin
    }
  end

  def user_with_groups(%User{} = user) do
    Map.merge(user(user), %{
      groups: for(group <- user.groups, do: GroupJSON.show(group).group)
    })
  end

  def token(%UserToken{} = token) do
    %{
      trackingId: token.tracking_id,
      context: token.context,
      insertedAt: token.inserted_at
    }
  end
end
