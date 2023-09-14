defmodule Nimble.Bills do
  @moduledoc false
  use Nimble.Web, :context

  alias Nimble.Bill
  alias Nimble.Repo

  def create(group_id, creator_id, params) do

    attrs = Map.merge(params, %{"creator_id" => creator_id, "group_id" => group_id})

    %Bill{}
    |> Bill.create_changeset(attrs)
    |> Repo.insert()
  end
end
