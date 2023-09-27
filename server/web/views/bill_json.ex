defmodule Nimble.BillJSON do
  def render("show.json", %{bill: bill}) do
    bill(bill)
  end

  def render("index.json", %{bills: bills}) do
    for(bill <- bills, do: bill(bill))
  end

  def bill(bill) do
    %{
      id: bill.id,
      description: bill.description,
      total: bill.total,
      status: bill.status,
      group_id: bill.group_id,
      creator_id: bill.creator_id,
      inserted_at: bill.inserted_at,
      updated_at: bill.updated_at,
      items: for(bill_item <- bill.items, do: bill_item(bill_item)),
      charges: for(bill_charge <- bill.charges, do: bill_charge(bill_charge)),
      creator: Nimble.UserJSON.user(bill.creator)
    }
  end

  def bill_item(bill_item) do
    %{
      id: bill_item.id,
      description: bill_item.description,
      notes: bill_item.notes,
      cost: bill_item.cost
    }
  end

  def bill_charge(bill_charge) do
    %{
      id: bill_charge.id,
      amount: bill_charge.amount,
      split_percent: bill_charge.split_percent,
      approved: bill_charge.approved,
      payment_status: bill_charge.payment_status,
      user: Nimble.UserJSON.user(bill_charge.user)
    }
  end
end
