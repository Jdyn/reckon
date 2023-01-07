defmodule Reckon.ErrorController do
  use Reckon.Web, :controller

  def call(conn, {:error, %Ecto.Changeset{} = changeset}) do
    conn
    |> put_status(:unprocessable_entity)
    |> put_view(Reckon.ErrorView)
    |> render("changeset_error.json", changeset: changeset)
  end

  def call(conn, {:not_found, reason}) do
    conn
    |> put_status(:not_found)
    |> put_view(Reckon.ErrorView)
    |> render("error.json", error: reason)
  end

  def call(conn, {:unauthorized, reason}) do
    conn
    |> put_status(:unauthorized)
    |> put_view(Reckon.ErrorView)
    |> render("error.json", error: reason)
  end

  def call(conn, {:error, %Assent.RequestError{} = error}) do
    conn
    |> put_status(:unauthorized)
    |> put_view(Reckon.ErrorView)
    |> render("error.json", error: error.message)
  end
end
