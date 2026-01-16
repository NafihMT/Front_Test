import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useContext } from 'react';
import '../Css/Login.css';
import axios from 'axios';
import { CartContext } from "../Components/CartContext/CartContext";
import { useNavigate } from 'react-router-dom';

function Login() {

    const API_URL = "http://localhost:5000/api";
    
    const { setUser } = useContext(CartContext);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ usr_name: "", password: "" });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    async function handleLogin(e) {
        e.preventDefault();
        if (!credentials.usr_name || !credentials.password) {
            toast.error("Please fill out all fields");
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/user/login`, {
                username: credentials.usr_name,
                password: credentials.password
            });

            const { jwtToken, user } = res.data.data;

            localStorage.setItem("token", jwtToken);
            localStorage.setItem("user", JSON.stringify(user));

            setUser(user);

            if (user.role === 'Admin') {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        }
    }

    return (
        <div className="main-login-container">
            <div className="login-box">
                <div className='input-box'>
                    <h1>Login</h1>
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder='Username'
                            name='usr_name'
                            value={credentials.usr_name}
                            onChange={handleChange} />
                        <br />
                        <input
                            type="password"
                            placeholder='Password'
                            name='password'
                            value={credentials.password}
                            onChange={handleChange} />
                        <br />
                        <button className="login-btn">Login</button>
                        <h6 className='create-msg'>Don't have an account yet?</h6>
                        <a className='register-link' onClick={() => navigate('/register')}>Create an Account</a>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;