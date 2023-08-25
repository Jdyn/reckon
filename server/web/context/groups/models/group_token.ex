defmodule Nimble.GroupToken do
  @moduledoc false
  use Nimble.Web, :model

  alias Nimble.Group
  alias Nimble.User

  @hash_algorithm :sha256
  @rand_size 32
  @tracking_id_size 16

  schema "groups_tokens" do
    field(:token, :binary)
    # invite:<identifier>
    field(:context, :string)
    field(:expiry, :utc_datetime)
    field(:sent_to, :string)

    field(:tracking_id, :string)

    belongs_to(:creator, User)
    belongs_to(:group, Group)

    timestamps(updated_at: false)
  end
end
