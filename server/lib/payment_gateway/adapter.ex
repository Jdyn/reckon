defmodule Nimble.PaymentGateway.Adapter do
  @callback process_payment(amount :: number) :: :ok | {:error, :invalid_amount}
end
