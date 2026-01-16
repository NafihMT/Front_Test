import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/Register.css';
import axios from "axios";
import { toast } from 'react-toastify';

function Register() {

    const API_URL = "http://localhost:5000/api/";

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNo: "", 
        usr_name: "",
        password: "",
        repeat_password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (formData.password !== formData.repeat_password) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                phoneNo: formData.phoneNo,
                username: formData.usr_name,
                password: formData.password
            };

            await axios.post(`${API_URL}register/registration`, payload);
            toast.success("Registration successful! Please log in.");
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        }
    }

    return (
        <div className="main-register-container">
            <div className="register-box">
                <div className="input-box">
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder='Full Name' name='name' onChange={handleChange} required />
                        <input type="email" placeholder='Email' name='email' onChange={handleChange} required />
                        <input type="text" placeholder='Phone Number' name='phoneNo' onChange={handleChange} required />
                        <input type="text" placeholder='Username' name='usr_name' onChange={handleChange} required />
                        <input type="password" placeholder='Password' name='password' onChange={handleChange} required />
                        <input type="password" placeholder='Repeat Password' name='repeat_password' onChange={handleChange} required />
                        <button className="register-btn" type='submit'>Register</button>
                        <br />
                        <a className='login-link' onClick={() => navigate('/login')}>Already have an account? </a>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;