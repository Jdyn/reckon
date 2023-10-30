defmodule Nimble.Bills.Query do
  @moduledoc false
  use Nimble.Repo

  alias Nimble.Bill
  alias Nimble.BillCharge
  alias Nimble.UserLike

  def bill(where) do
    from(b in Bill, where: ^where)
  end

  def charge_from_bill(bill_id, user_id) do
    from(c in BillCharge, where: c.bill_id == ^bill_id and c.user_id == ^user_id)
  end

  def charge_from_user(charge_id, user_id) do
    from(c in BillCharge, where: c.id == ^charge_id and c.user_id == ^user_id)
  end

  def bill_like(bill_id, user_id) do
    from(ul in UserLike, where: ul.bill_id == ^bill_id and ul.user_id == ^user_id)
  end
end
