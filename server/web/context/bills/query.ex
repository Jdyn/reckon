defmodule Nimble.Bills.Query do
  @moduledoc false
  use Nimble.Web, :context

  alias Nimble.UserLedger

  def ledger_from_user_query(user_id) do
    from(ul in UserLedger, where: ul.user_id == ^user_id, select: ul)
  end
end
