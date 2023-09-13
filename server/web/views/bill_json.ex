defmodule Nimble.BillJSON do
  def render("show.json", %{bill: bill}) do
    %{
      bill: bill(bill)
    }
  end

  def render("index.json", %{bills: bills}) do
    %{
      bills: for(bill <- bills, do: bill(bill))
    }
  end

  def bill(bill) do
    %{
      id: bill.id,
      description: bill.description,
      total: bill.total,
      group_id: bill.group_id,
      creator_ledger_id: bill.creator_ledger_id,
      inserted_at: bill.inserted_at,
      updated_at: bill.updated_at,
      bill_items: for(bill_item <- bill.items, do: bill_item(bill_item)),
    }
  end

  def bill_item(bill_item) do
    %{
      id: bill_item.id,
      description: bill_item.description,
      notes: bill_item.notes,
      cost: bill_item.cost,
      bill_id: bill_item.bill_id,
      inserted_at: bill_item.inserted_at,
      updated_at: bill_item.updated_at
    }
  end
end
