defmodule Nimble.Bills.Query do
  @moduledoc false
  use Nimble.Repo

  alias Nimble.Bill
  alias Nimble.BillCharge
  alias Nimble.UserLike

  def bill(where) do
    from(b in Bill, where: ^where)
  end

  def charge(where) do
    from(c in BillCharge, where: ^where)
  end

  def bill_like(bill_id, user_id) do
    from(ul in UserLike, where: ul.bill_id == ^bill_id and ul.user_id == ^user_id)
  end
end
