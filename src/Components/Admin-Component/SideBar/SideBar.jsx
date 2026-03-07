import React, { useContext } from 'react';
import './SideBar.css';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../CartContext/CartContext';
import { toast } from 'react-toastify';
import api from '../../../api/api'

function SideBar({ currentPage, setCurrentPage }) {
    const { setUser } = useContext(CartContext);
    const menu = ["dashboard", "products", "users", "order"];
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post("/user/logout");
        } catch (err) {
            console.error(err.message);
        }

        localStorage.clear();
        setUser(null);
        navigate("/login");
    };

    return (
        <div className="sidebar-main-container">
            <div>
                <h2 className='admin-panel'>Admin Panel</h2>
                <ul className="menu">
                    {menu.map((item) => (
                        <li
                            key={item}
                            onClick={() => setCurrentPage(item)}
                            className={`menu-item ${currentPage === item ? "active" : ""}`}
                        >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </li>
                    ))}
                </ul>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </div>
    );
}

export default SideBar;