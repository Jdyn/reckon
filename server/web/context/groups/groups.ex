defmodule Nimble.Groups do
  @moduledoc """
  The Groups context.
  """
  use Nimble.Web, :model

  alias Ecto.Multi
  alias Nimble.Group
  alias Nimble.GroupMember
  alias Nimble.Groups.Query
  alias Nimble.Repo
  alias Nimble.User

  @doc """
  Returns all of the groups that the user is a member of.

  ## Examples

      iex> list_groups()
      [%Group{}, ...]

  """
  def list_user_groups(%User{} = user) do
    Repo.all(Query.groups_for_member(user.id))
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

  @doc """
  Checks if a user is a member of a group.

  ## Examples

      iex> is_member?(group_id, valid_member_id)
      true

      iex> is_member?(group_id, invalid_member_id)
      false

  """
  def is_member?(group_id, identifier: identifier) do
    Repo.exists?(Query.group_member(group_id, identifier: identifier))
  end

  def is_member?(group_id, user_id) do
    Repo.exists?(Query.group_member(group_id, user_id))
  end

  @doc """
  Updates the `updated_at` field on the `GroupMember` join table
  to indicate that the user has just viewed the group.

  ## Examples

      iex> update_member_last_seen(group_id, user_id)
      %GroupMember{}

  """
  def update_member_last_seen(group_id, user_id) do
    member = Repo.one(Query.group_member(group_id, user_id))
    Repo.update!(GroupMember.changeset(member, %{updated_at: DateTime.utc_now()}))
  end

  @doc """
  Gets a group for a user.

  ## Examples

      iex> get_group_for_user(group_id, user_id)
      {:ok, %Group{}}

      iex> get_group_for_user(group_id, user_id)
      {:error, "You are not a member, or this group does not exist."}

  """
  def get_group_for_user(group_id, user_id) do
    case Repo.one(Query.group_for_member(group_id, user_id)) do
      nil ->
        {:error, "You are not a member, or this group does not exist."}

      group ->
        {:ok, Repo.preload(group, [:creator, :members])}
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

  def add_member(group_id, user_id) do
    Repo.insert(GroupMember.changeset(%GroupMember{}, %{group_id: group_id, user_id: user_id}))
  end

  def remove_member!(%Group{} = group, %User{} = user) do
    Repo.delete!(Repo.one(Query.group_member(group.id, user.id)))
  end
end
