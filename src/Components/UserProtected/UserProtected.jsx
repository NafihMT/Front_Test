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
                    const response = await axios.get(`http://localhost:5000/api/user/profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    const freshUserData = response.data.data;

                    if (freshUserData && freshUserData.status === 'Inactive') {
                        toast.warn("Your account has been deactivated.");
                        handleLogout();
                    }
                } catch (error) {
                    if (error.response?.status === 401) {
                        handleLogout();
                    }
                }
            };
            checkUserStatus();
        }
    }, [location, user]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Convert everything to lowercase for a safe comparison
    const userRole = user.role?.toLowerCase();
    const rolesAllowed = allowedRoles.map(r => r.toLowerCase());

    if (!rolesAllowed.includes(userRole)) {
        // Redirect based on actual role if they try to access a forbidden page
        return <Navigate to={userRole === 'admin' ? '/admin' : '/'} replace />;
    }

    return children;
};

export default ProtectedRoute;