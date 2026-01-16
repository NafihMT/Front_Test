import React, { useState, useEffect } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import UserList from './UsersList/UsersList';
import EditUser from './EditUser/EditUser';
import AddUser from './AddUser/AddUser';
import Pagination from './Pagination/UserPagination'
import './Users.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModelOpen, setIsAddModalOpen] = useState(false);

  const [isEditModelOpen, setIsEditModelOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

   const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(3); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);



  const handleAddUser = async (newUserData) => {
    const isDuplicate = users.some(user => user.email.toLowerCase() === newUserData.email.toLowerCase());
    if (isDuplicate) {
      toast.error('A user with this email already exists!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData),
      });
      if (!response.ok) throw new Error('Failed to add user.');

      const addedUser = await response.json();
      setUsers(prevUsers => [...prevUsers, addedUser]);
      toast.success('User added successfully!');
      setIsAddModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:3001/users/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete user.');

        setUsers(users.filter(user => user.id !== id));
        toast.success('User deleted successfully!');
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleEditUser = (id) => {
    const userToEdit = users.find(user => user.id === id);
    setEditingUser(userToEdit);
    setIsEditModelOpen(true);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      if (!response.ok) throw new Error('Failed to update user.');

      setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
      toast.success('User updated successfully!');
      setIsEditModelOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.f_name && user.f_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // --- Pagination Logic ---
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // --- Change page handler ---
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- Reset to page 1 on search ---
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="users-view">

      <div className="users-header">
        <h2 className='products-title'>Users</h2>
        <button className="add-product-btn" onClick={() => setIsAddModalOpen(true)}>
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