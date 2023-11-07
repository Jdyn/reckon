defmodule Nimble.PaymentMethod do
  @moduledoc false
  use Nimble.Web, :model

  alias Nimble.User

  schema "payment_method" do
    field(:vendor, :string)

    # i.e reusable auth token to use on behalf of the user, required by the vendor
    field(:access_token, :string)

    # i.e Plaid account_id
    field(:method_id, :string)

    # i.e bank name
    field(:name, :string)

    belongs_to(:user, User)

    timestamps()
  end
end
