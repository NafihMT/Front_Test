import React, { useState, useEffect } from 'react';

function EditUser({ user, onSave, onClose }) {
    const [formData, setFormData] = useState(user);

    useEffect(() => {
        setFormData(user);
    }, [user]);

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
                <h2>Edit User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="f_name">Full Name</label>
                        <input type="text" id="f_name" name="f_name" value={formData.f_name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                     <div className="form-group">
                        <label htmlFor="type">Role</label>
                        <select id="type" name="type" value={formData.type} onChange={handleChange}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select id="status" name="status" value={formData.status} onChange={handleChange}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-save">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditUser;