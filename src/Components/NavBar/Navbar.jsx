import React, { useState, useEffect, useContext } from 'react';
import { ShoppingCart, User, Heart, Search } from "lucide-react";
import api from "../../api/api";
import './Navbar.css';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from "../CartContext/CartContext";

const API_URL = "http://localhost:5000/api";

function Navbar() {
    const [open, setOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const [categories, setCategories] = useState([]);

    const { cart, wishlist, user, setUser, setCart, setWishlist } = useContext(CartContext);

    const cartCount = cart?.length || 0;
    const wishlistCount = wishlist.length;
    const navigate = useNavigate();

    const isAdmin = user?.role === 'Admin';
    const isUser = user?.role === 'User';

    useEffect(() => {
        api.get(`${API_URL}/categories`)
            .then(res => setCategories(res.data))
            .catch(err => console.error("Error fetching categories:", err));
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        setCart([]);
        setWishlist([]);
        navigate("/login");
    };

    const handleCategorySelect = (categoryName) => {
        navigate(`/store?category=${encodeURIComponent(categoryName)}`);
        setOpen(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const query = searchTerm.trim();
        navigate(query ? `/store?search=${encodeURIComponent(query)}` : "/store");
    };

    return (
        <nav className={`main-navbar ${scrolled ? "scrolled" : "transparent"}`}>
            <div className="nav-left">
                <h1 className="logo" onClick={() => navigate('/')}>MasterHead</h1>
                <ul className="nav-links">
                    {/* The "onMouseLeave" must be on the <li> wrapper to keep the menu open while hovering it */}
                    <li className="dropdown" onMouseEnter={() => setOpen(true)} onClick={() => setOpen(false)}>
                        <Link to="#" className="dropdown-trigger">Helmets ▾</Link>
                        {open && (
                            <ul className="dropdown-menu">
                                <li className="dropdown-btn" onClick={() => handleCategorySelect("All")}>All</li>
                                {categories.map(cat => (
                                    <li key={cat.id} className="dropdown-btn" onClick={() => handleCategorySelect(cat.name)}>
                                        {cat.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                    {isUser && (
                        <>
                            <li><Link to="/store">Store</Link></li>
                            <li><Link to="/orders">My Orders</Link></li>
                        </>
                    )}
                    {isAdmin && (
                        <li><Link to="/admin" style={{ color: '#ff4d4d', fontWeight: 'bold' }}>Admin Panel</Link></li>
                    )}
                </ul>
            </div>

            <div className="nav-search">
                <form onSubmit={handleSearch} className="search-wrapper">
                    {/* <Search className="search-icon" size={18} /> */}
                    <input
                        type="text"
                        placeholder="Search helmets..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </form>
            </div>

            <div className="nav-right">
                {isUser && (
                    <>
                        <div className="icon-wrapper" onClick={() => navigate("/wishlist")}>
                            <Heart className="icon" />
                            {wishlistCount > 0 && <span className="count">{wishlistCount}</span>}
                        </div>
                        <div className="icon-wrapper" onClick={() => navigate("/cart")}>
                            <ShoppingCart className="icon" />
                            {cartCount > 0 && <span className="count">{cartCount}</span>}
                        </div>
                    </>
                )}

                <div className="profile-container" onMouseEnter={() => setProfileOpen(true)} onClick={() => setProfileOpen(false)}>
                    <div className="profile-trigger">
                        <User className="icon" />
                        {/* <span className="profile-greeting">
                            <span>Hi, {user?.firstName || user?.username || "Guest"}</span>
                        </span> */}
                    </div>
                    {profileOpen && (
                        <ul className='profile-menu'>
                            {user ? (
                                <>
                                    {isAdmin && <li onClick={() => navigate('/dashboard')}>Dashboard</li>}
                                    <li onClick={handleLogout}>Logout</li>
                                </>
                            ) : (
                                <li onClick={() => navigate('/login')}>Login</li>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;