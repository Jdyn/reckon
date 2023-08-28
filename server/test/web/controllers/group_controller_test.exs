defmodule Nimble.GroupControllerTest do
  use Nimble.ConnCase, async: true

  import Nimble.GroupsFixtures

  alias Nimble.Group
  alias Nimble.Groups

  @create_attrs %{
    name: "some name"
  }
  @update_attrs %{
    name: "some updated name"
  }
  @invalid_attrs %{name: nil}

  setup :register_and_log_in_user

  describe "index" do
    test "lists all groups for user with no groups", %{conn: conn} do
      conn = get(conn, ~p"/api/groups")
      assert json_response(conn, 200)["groups"] == []
    end

    test "lists all groups for the user with groups", %{conn: conn, user: user} do
      group_id = group_fixture(%{creator_id: user.id}).id
      conn = get(conn, ~p"/api/groups")

      assert List.first(json_response(conn, 200)["groups"]) == %{
               "id" => group_id,
               "name" => "some name"
             }
    end
  end

  describe "create group" do
    test "renders group when data is valid", %{conn: conn} do
      conn = post(conn, ~p"/api/groups", group: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, ~p"/api/groups/#{id}")

      assert %{
               "id" => ^id,
               "name" => "some name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, ~p"/api/groups", group: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update group" do
    setup [:create_group]

    test "renders group when data is valid", %{conn: conn, group: %Group{id: id} = group} do
      conn = put(conn, ~p"/api/groups/#{group}", group: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, ~p"/api/groups/#{id}")

      assert %{
               "id" => ^id,
               "name" => "some updated name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, group: group} do
      conn = put(conn, ~p"/api/groups/#{group}", group: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete group" do
    setup [:create_group]

    test "deletes chosen group", %{conn: conn, group: group} do
      conn = delete(conn, ~p"/api/groups/#{group}")
      assert response(conn, 204)

      assert_error_sent(404, fn ->
        get(conn, ~p"/api/groups/#{group}")
      end)
    end
  end

  defp create_group(_) do
    group = group_fixture()
    %{group: group}
  end
end
