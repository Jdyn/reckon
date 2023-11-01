defmodule Nimble.CategoryController do
  use Nimble.Web, :controller

  alias Nimble.Bills

  def create(conn, params) do
    with {:ok, category} <- Bills.create_category(params) do
      render(conn, "show_category.json", category: category)
    end
  end

  def delete(conn, %{ "category_id" => id}) do
    with :ok <- Bills.delete_category(id) do
      json(conn, %{ok: true})
    end
  end
end
