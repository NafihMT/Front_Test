import React, { useState } from 'react';

function AddUser({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        f_name: '',
        email: '',
        usr_name: '',
        password: '',
        type: 'user', 
        status: 'Active'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Add New User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="f_name">Full Name</label>
                        <input type="text" id="f_name" name="f_name" value={formData.f_name} onChange={handleChange} required />
                    </div>
                     <div className="form-group">
                        <label htmlFor="usr_name">Username</label>
                        <input type="text" id="usr_name" name="usr_name" value={formData.usr_name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                     <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                     <div className="form-group">
                        <label htmlFor="type">Role</label>
                        <select id="type" name="type" value={formData.type} onChange={handleChange}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-save">Add User</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddUser;