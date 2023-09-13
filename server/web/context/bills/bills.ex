defmodule Nimble.Bills do
  @moduledoc false
  use Nimble.Web, :context

  alias Nimble.Accounts.Users
  alias Nimble.Bill
  alias Nimble.Repo

  def create(group_id, creator_id, params) do
    ledger = Users.get_ledger(creator_id)

    attrs = Map.merge(params, %{"creator_ledger_id" => ledger.id, "group_id" => group_id})

    %Bill{}
    |> Bill.create_changeset(attrs)
    |> Repo.insert()
  end
end
