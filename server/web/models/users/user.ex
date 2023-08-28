defmodule Nimble.User do
  @moduledoc """
  Defines a User model to track and authenticate users across the application.
  """
  use Nimble.Web, :model

  alias Nimble.GroupMember
  alias Nimble.Repo
  alias Nimble.User
  alias Nimble.UserToken
  alias Nimble.Util.PhoneNumber

  @derive {Inspect, except: [:password]}

  @registration_fields ~w(identifier username full_name)a
  @update_fields ~w(email phone username full_name)a
  @email_regex ~r/^[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+$/i

  schema "users" do
    # Field used to accept an email OR phone to create an account.
    field(:identifier, :string, virtual: true)

    field(:email, :string)
    field(:phone, :string)
    field(:username, :string)
    field(:full_name, :string)
    field(:avatar, :string)
    field(:password_hash, :string)
    field(:password, :string, virtual: true)
    field(:confirmed_at, :naive_datetime)
    field(:is_admin, :boolean, default: false)
    has_many(:tokens, UserToken)

    many_to_many(:groups, Nimble.Group, join_through: GroupMember)

    timestamps()
  end

  @doc """
  A user changeset for registration.
  """
  def registration_changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, [:identifier, :username, :full_name, :password])
    |> validate_required([:identifier, :username, :full_name, :password])
    |> validate_identifier()
    |> maybe_validate_email_constraints()
    |> maybe_validate_phone_constraints()
    |> validate_password()
    |> validate_username()
    |> check_constraint(:identifier, name: :valid_email_or_phone, message: "Could not ensure a valid email or phone")
  end

  def oauth_registration_changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, @registration_fields)
    |> validate_required(@registration_fields)
    |> confirm_oauth_email(attrs.email_verified)
  end

  def update_changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, @update_fields)
    |> validate_required(@update_fields)
    |> validate_identifier()
  end

  @doc """
  Validates an `identifier` field in the changeset.
  It determines if the field is an e-mail, phone number or username.
  After determining, it calls the appropriate validation function,
  and puts the identifier in the `email`, `phone` or `username` field.
  """
  def validate_identifier(changeset) do
    identifier = get_change(changeset, :identifier)

    if not is_nil(identifier) and String.match?(identifier, @email_regex) do
      validate_email(changeset)
    else
      validate_phone(changeset)
    end
  end

  defp validate_email(changeset) do
    identifier = get_change(changeset, :identifier) || get_change(changeset, :email)

    changeset
    |> put_change(:email, identifier)
    |> validate_required([:email])
    |> update_change(:email, &String.downcase(&1))
    |> validate_format(:email, @email_regex, message: "must be a valid email address")
    |> validate_length(:email, max: 80)
    |> put_change(:identifier, get_change(changeset, :email))
  end

  defp maybe_validate_email_constraints(changeset) do
    if get_change(changeset, :email) do
      changeset
      |> unsafe_validate_unique(:email, Repo)
      |> unique_constraint(:email)
    else
      changeset
    end
  end

  defp validate_phone(changeset) do
    phone = get_change(changeset, :identifier)

    with {:ok, phone_number} <- PhoneNumber.parse_phone_number(phone),
         true <- PhoneNumber.possible_phone?(phone_number),
         true <- PhoneNumber.valid_phone?(phone_number) do
      phone_number = PhoneNumber.format_phone_number(phone_number, :e164)

      changeset
      |> put_change(:phone, phone_number)
      |> validate_required([:phone])
      |> validate_length(:phone, max: 25)
      |> put_change(:identifier, phone_number)
    else
      {:error, message} -> add_error(changeset, :phone, message)
      _ -> add_error(changeset, :phone, "That's not a valid United States phone number.")
    end
  end

  defp maybe_validate_phone_constraints(changeset) do
    if get_change(changeset, :phone) do
      changeset
      |> unsafe_validate_unique(:phone, Repo)
      |> unique_constraint(:phone)
    else
      changeset
    end
  end

  defp validate_username(changeset) do
    changeset
    |> validate_format(:username, ~r/^(?!.*[_. ]{2})/,
      message: "cannot contain consecutive underscores, spaces, or periods"
    )
    |> validate_format(:username, ~r/^[^_. ].*[^_. ]$/,
      message: "cannot start or end with underscores, spaces, or periods"
    )
    |> validate_format(:username, ~r/^[a-zA-Z0-9._ ]+$/,
      message: "can only contain alphanumeric characters, underscores, spaces, and periods"
    )
    |> validate_length(:username, min: 3, max: 20)
    |> unsafe_validate_unique(:username, Repo)
    |> unique_constraint(:username)
  end

  defp validate_password(changeset) do
    changeset
    |> validate_required([:password])
    |> validate_length(:password, min: 12, max: 80)
    |> validate_format(:password, ~r/[a-z]/, message: "at least one lower case character")
    |> validate_format(:password, ~r/[A-Z]/, message: "at least one upper case character")
    |> validate_format(:password, ~r/[!?@#$%^&*_0-9]/, message: "at least one digit or punctuation character")
    |> prepare_changes(&maybe_hash_password/1)
  end

  defp maybe_hash_password(changeset) do
    if password = get_change(changeset, :password) do
      changeset
      |> put_change(:password_hash, Pbkdf2.hash_pwd_salt(password))
      |> delete_change(:password)
    else
      changeset
    end
  end

  @doc """
  A user changeset for changing the e-mail.
  It requires the e-mail to change otherwise an error is added.
  """
  def email_changeset(user, attrs) do
    user
    |> cast(attrs, [:email])
    |> validate_email()
    |> case do
      %{changes: %{email: _}} = changeset -> changeset
      %{} = changeset -> add_error(changeset, :email, "did not change")
    end
  end

  @doc """
  A user changeset for changing the password.
  """
  def password_changeset(user, attrs) do
    user
    |> cast(attrs, [:password])
    |> validate_confirmation(:password, message: "does not match password")
    |> validate_password()
  end

  @doc """
  Confirms the account by setting `confirmed_at`.
  """
  def confirm_changeset(user_or_changeset) do
    now = NaiveDateTime.truncate(NaiveDateTime.utc_now(), :second)
    change(user_or_changeset, confirmed_at: now)
  end

  def confirm_oauth_email(changeset, true) do
    now = NaiveDateTime.truncate(NaiveDateTime.utc_now(), :second)
    change(changeset, confirmed_at: now)
  end

  def confirm_oauth_email(changeset, false), do: add_error(changeset, :email_verified, "Email not verified")

  @doc """
  Verifies the password.
  If there is no user or the user doesn't have a password, we call
  `Bcrypt.no_user_verify/0` to avoid timing attacks.
  """
  def valid_password?(%User{password_hash: password_hash}, password)
      when is_binary(password_hash) and byte_size(password) > 0 do
    Pbkdf2.verify_pass(password, password_hash)
  end

  def valid_password?(_, _), do: Pbkdf2.no_user_verify()

  @doc """
  Validates the current password otherwise adds an error to the changeset.
  """
  def validate_current_password(changeset, password) do
    if valid_password?(changeset.data, password) do
      changeset
    else
      add_error(changeset, :current_password, "is not valid")
    end
  end
end
