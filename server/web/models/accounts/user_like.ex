defmodule Nimble.UserLike do
  @moduledoc false
  use Nimble.Web, :model

  alias Nimble.Bill
  alias Nimble.User

  schema "users_likes" do
    belongs_to(:user, User)
    belongs_to(:bill, Bill)

    timestamps()
  end

  @doc false
  def changeset(user_like, attrs) do
    user_like
    |> cast(attrs, [:user_id, :bill_id])
    |> validate_required([:user_id, :bill_id])
  end
end
