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
  Returns the list of groups.

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
    Repo.delete!(Repo.one(Query.find_group_member(group.id, user.id)))
  end
end
