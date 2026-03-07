import React, { useState, useEffect } from "react";
import { PlusCircle, Search } from "lucide-react";
import { toast } from "react-toastify";
import UserList from "./UsersList/UsersList";
import EditUser from "./EditUser/EditUser";
import AddUser from "./AddUser/AddUser";
import Pagination from "./Pagination/UserPagination";
import api from "../../../api/api";
import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModelOpen, setIsAddModalOpen] = useState(false);
  const [isEditModelOpen, setIsEditModelOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(3);

  // 🔥 Fetch from real backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/user"); // must match your backend route
        setUsers(response.data.data); // assuming ApiResponse wrapper
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (newUserData) => {
    try {
      const response = await api.post("/user", newUserData);

      setUsers((prev) => [response.data.data, ...prev]);
      toast.success("User added successfully!");
      setIsAddModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/user/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success("User deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleEditUser = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setEditingUser(userToEdit);
    setIsEditModelOpen(true);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {

      const payload = {
        Name: updatedUser.name,
        Email: updatedUser.email,
        PhoneNo: updatedUser.phoneNo,
        Role: updatedUser.role,
        IsBlocked: updatedUser.isBlocked
      };

      const response = await api.put(`/user/${updatedUser.id}`, payload);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === updatedUser.id ? response.data.data : user
        )
      );

      toast.success("User updated successfully!");
      setIsEditModelOpen(false);

    } catch (err) {
      console.log(err.response?.data);
      toast.error("Failed to update user");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="users-view">
      <div className="users-header">
        <h2 className="products-title">Users</h2>
        <button
          className="add-product-btn"
          onClick={() => setIsAddModalOpen(true)}
        >
          <PlusCircle size={20} />
          <span>Add User</span>
        </button>
      </div>

      <div className="search-container">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="user-list-container">
        <UserList
          users={currentUsers}
          loading={loading}
          error={error}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      </div>

      {totalPages > 1 && (
        <Pagination
          usersPerPage={usersPerPage}
          totalUsers={filteredUsers.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      )}

      {isEditModelOpen && (
        <EditUser
          user={editingUser}
          onSave={handleUpdateUser}
          onClose={() => setIsEditModelOpen(false)}
        />
      )}

      {isAddModelOpen && (
        <AddUser
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddUser}
        />
      )}
    </div>
  );
}

export default Users;