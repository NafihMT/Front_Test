import React, { useState, useEffect } from "react";

function EditUser({ user, onSave, onClose }) {

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        // username: "",
        email: "",
        phoneNo: "",
        role: "User",
        isBlocked: false
    });

    useEffect(() => {
        if (user) {
            setFormData({
                id: user.id,
                name: user.name || "",
                // username: user.username || user.userName || "",
                email: user.email || "",
                phoneNo: user.phoneNo || "",
                role: user.role || "User",
                isBlocked: user.isBlocked || false
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Edit User</h2>

                <form onSubmit={handleSubmit}>

                    {/* Full Name */}
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Username
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div> */}

                    {/* Email */}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="phoneNo"
                            value={formData.phoneNo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Role */}
                    <div className="form-group">
                        <label>Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="btn-save">
                            Save Changes
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default EditUser;