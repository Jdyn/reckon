defmodule Reckon.ErrorView do
  use Reckon.Web, :view

  alias Reckon.ErrorHelpers

  # Customize a particular status code:
  # def render("500.json", _assigns) do
  #   %{errors: %{detail: "Internal Server Error"}}
  # end

  def render("changeset_error.json", %{changeset: changeset}) do
    errors =
      Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
        ErrorHelpers.translate_error({msg, opts})
      end)

    %{
      errors: errors
    }
  end

  def render("error.json", %{error: reason}) do
    %{
      errors: [%{"detail" => reason}]
    }
  end
end
