defmodule Nimble.Errors do
  @moduledoc """
  Conveniences for translating and building error messages.
  """

  @doc """
  Translates an error message.
  """
  def translate_error({msg, opts}) do
    # Because the error messages we show in our forms and APIs
    # are defined inside Ecto, we need to translate them dynamically.
    Enum.reduce(opts, msg, fn {key, value}, acc ->
      value = if is_list(value), do: List.first(value), else: value
      String.replace(acc, "%{#{key}}", to_string(value))
    end)
  end
end
