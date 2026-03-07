import React from 'react';
import './UsersList.css';

function UserList({ users, loading, error, onEdit, onDelete }) {

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="user-cards-list">
            {users.map(user => (
                <div className="user-card" key={user.id}>
                    <div className="user-details">
                        <p className="user-name">{user.f_name}</p>
                        <p className="user-email">{user.email}</p>
                    </div>
                    <div className="user-role">{user.type}</div>
                    <div className="user-status">
                        <span className={`status-badge status--${user.status}`}>
                            {user.status}
                        </span>
                    </div>
                    <div className="user-actions">
                        <button onClick={() => onEdit(user.id)} className="action-btn edit-btn">Edit</button>
                        <button onClick={() => onDelete(user.id)} className="action-btn delete-btn">Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default UserList;