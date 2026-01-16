import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext/CartContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, setUser } = useContext(CartContext);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const checkUserStatus = async () => {
                try {
                    const token = localStorage.getItem('token');
                    
                    // Connected to Port 5000 with proper JWT Headers
                    const response = await axios.get(`http://localhost:5000/api/user/profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    // ApiResponse structure: response.data.data
                    const freshUserData = response.data.data;

                    if (freshUserData && freshUserData.status === 'Inactive') {
                        toast.warn("Your account has been deactivated by admin.");
                        handleLogout();
                    }
                } catch (error) {
                    // Handle 401 Unauthorized or 404 Not Found by logging out
                    if (error.response?.status === 401 || error.response?.status === 404) {
                        handleLogout();
                    }
                    console.error("Status check failed:", error);
                }
            };

            checkUserStatus();
        }
    }, [location, user, setUser, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const userRole = user.role;

    // Support for both string role name and Enum integer (Admin = 1)
    const isAdmin = userRole === 'Admin' || userRole === 1;

    if (!allowedRoles.includes(userRole)) {
        const redirectTo = isAdmin ? '/admin' : '/';
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default ProtectedRoute;