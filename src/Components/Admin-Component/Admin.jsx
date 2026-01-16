import React, { useState } from 'react';
import { User } from "lucide-react";
import './Admin.css';
import SideBar from './SideBar/SideBar'
import { useNavigate } from 'react-router-dom';
import Dashboard from './DashBoard/Dashboard';
import Products from './Products/Products'
import Users from './Users/Users'
import OrderManage from '../Admin-Component/Orders-Section/OrderManage';


function Admin() {
    const [currentPage, setCurrentPage] = useState("dashboard");
    const renderPage = () => {
        if (currentPage === "dashboard") {
            return <Dashboard />
        }
        else if (currentPage === "products") {
            return <Products />
        }
        else if (currentPage === "users") {
            return <Users />
        }
        else if (currentPage === "order") {
            return <OrderManage />
        }
    }
    const navigate = useNavigate();
    const handleLogin = (e) => {
        e.preventDefault();
        navigate("/login")
    }
    return (
        <div>
            <div className="admin-main-container">
                <div className="admin-left-container">
                    <SideBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </div>

                <div className="admin-right-container">
                    {renderPage()}

                </div>
            </div>
        </div>
    );
}

export default Admin;

