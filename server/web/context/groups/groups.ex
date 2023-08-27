defmodule Nimble.Groups do
  @moduledoc """
  The Groups context.
  """
  use Nimble.Web, :model

  alias Ecto.Multi
  alias Nimble.Group
  alias Nimble.GroupInvite
  alias Nimble.GroupMember
  alias Nimble.Groups.Query
  alias Nimble.Repo
  alias Nimble.User
  alias Nimble.UserNotifier
  alias Nimble.Users

  @doc """
  Returns the list of groups.

  ## Examples

      iex> list_groups()
      [%Group{}, ...]

  """
  def list_user_groups(%User{} = user) do
    Repo.all(Query.groups_for_member(user.id))
  end

  # def deliver_group_invite_link(%Group{} = group, %User{} = user, sent_to) do
  #   {encoded_token, group_token} = GroupInvite.build_invite_token(group, user, sent_to)
  #   Repo.insert!(group_token)

  #   recipient = Users.get_by_identifier(sent_to)

  #   UserNotifier.deliver_group_invite_instructions(recipient, encoded_token)
  #   {:ok, encoded_token}
  # end

  def invite_member(group_id, sender, identifier) do
    with recipient = %User{} <- Users.get_by_identifier(identifier) do
      Repo.insert!(%GroupInvite{
        group_id: String.to_integer(group_id),
        sender_id: sender.id,
        recipient: %{:identifier => recipient.email}
      })
      :ok
    end
  end

  @doc """
  Gets a single group.

  Raises `Ecto.NoResultsError` if the Group does not exist.

  ## Examples

      iex> get_group!(123)
      %Group{}

      iex> get_group!(456)
      ** (Ecto.NoResultsError)

  """
  def get_group!(id), do: Repo.get!(Group, id)

  def get_group(id), do: Repo.get(Group, id)

  def is_member?(group_id, user_id) do
    Repo.exists?(Query.group_member(group_id, user_id))
  end

  def update_member_last_seen(group_id, user_id) do
    member = Repo.one(Query.group_member(group_id, user_id))
    Repo.update!(GroupMember.changeset(member, %{updated_at: DateTime.utc_now()}))
  end

  def get_group_for_user(group_id, user_id) do
    case Repo.one(Query.group_for_member(group_id, user_id)) do
      nil -> {:error, "You are not a member, or this group does not exist."}
      group -> {:ok, group}
    end
  end

  @doc """
  Creates a group.

  ## Examples

      iex> create_group(%{field: value})
      {:ok, %Group{}}

      iex> create_group(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_group(attrs \\ %{}) do
    with {:ok, result} <-
           Multi.new()
           |> Multi.insert(:group, Group.changeset(%Group{}, attrs))
           |> Multi.insert(:group_creator, fn %{group: group} ->
             GroupMember.changeset(%GroupMember{}, %{group_id: group.id, user_id: group.creator_id})
           end)
           |> Repo.transaction() do
      {:ok, Repo.preload(result[:group], [:creator, :members])}
    end
  end

  @doc """
  Updates a group.

  ## Examples

      iex> update_group(group, %{field: new_value})
      {:ok, %Group{}}

      iex> update_group(group, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_group(%Group{} = group, attrs) do
    group
    |> Group.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a group.

  ## Examples

      iex> delete_group(group)
      {:ok, %Group{}}

      iex> delete_group(group)
      {:error, %Ecto.Changeset{}}

  """
  def delete_group(%Group{} = group) do
    Repo.delete(group)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking group changes.

  ## Examples

      iex> change_group(group)
      %Ecto.Changeset{data: %Group{}}

  """
  def change_group(%Group{} = group, attrs \\ %{}) do
    Group.changeset(group, attrs)
  end

  def add_member(%Group{} = group, %User{} = user) do
    Repo.insert!(GroupMember.changeset(%GroupMember{}, %{group_id: group.id, user_id: user.id}))
  end

  def remove_member(%Group{} = group, %User{} = user) do
    Repo.delete!(Repo.one(Query.group_member(group.id, user.id)))
  end
end
