import React, { useState, useEffect, useContext } from 'react';
import { ShoppingCart, User, Heart } from "lucide-react";
import './Navbar.css';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from "../CartContext/CartContext";

function Navbar() {
    const [open, setOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const [users, setUsers] = useState(null)

    const { cart, setCart, wishlist, setWishlist, user } = useContext(CartContext);
    const cartCount = cart.length;
    const wishlistCount = wishlist.length;
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setUsers(JSON.parse(storedUser))
        }
    }, [])
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        navigate("/login");
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setCart([]);
        setWishlist([]);
        window.location.reload();
        navigate("/");
    };

    const handleCategorySelect = (category) => {
        navigate(`/store?category=${encodeURIComponent(category)}`);
        setOpen(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/store?search=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            navigate("/store");
        }
    };

    return (
        <div>
            <nav
                className={`main-navbar ${scrolled ? "scrolled" : "transparent"}`}
                onClick={() => setOpen(false)}
            >
                <div className="nav-left">
                    <h1 className="logo" onClick={() => navigate('/')}>MasterHead</h1>
                    <ul className="nav-links">
                        <li
                            className="dropdown"
                            onMouseEnter={() => setOpen(true)}
                        >
                            <Link to="#">Helmets ▾</Link>
                            {open && (
                                <ul className="dropdown-menu"
                                    onClick={() => setOpen(false)}
                                >
                                    <li className="dropdown-btn" onClick={() => handleCategorySelect("Full Face")}>Full Face Helmet</li>
                                    <li className="dropdown-btn" onClick={() => handleCategorySelect("Open Face")}>Open Face Helmet</li>
                                    <li className="dropdown-btn" onClick={() => handleCategorySelect("Women")}>Women Helmet</li>
                                    <li className="dropdown-btn" onClick={() => handleCategorySelect("Junior")}>Junior Helmet</li>
                                </ul>
                            )}
                        </li>
                        <li><Link to="/store">Store</Link></li>
                        <li><Link to="/orders">My Orders</Link></li>
                    </ul>
                </div>

                <div className="nav-search">
                    <form onChange={handleSearch} onSubmit={handleSearch} style={{ display: "flex", alignItems: "center" }}>
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #ccc", marginLeft: "5px" }}
                        />
                    </form>
                </div>

                <div className="nav-right">
                    <div className="icon-wrapper" onClick={() => user ? navigate("/wishlist") : navigate("/login")}>
                        <Heart className="icon" />
                        {wishlistCount > 0 && <span className="count">{wishlistCount}</span>}
                    </div>

                    <div className="icon-wrapper" onClick={() => user ? navigate("/cart") : navigate("/login")}>
                        <ShoppingCart className="icon" />
                        {cartCount > 0 && <span className="count">{cartCount}</span>}
                    </div>

                    <div className="icon-wrapper">
                        <User
                            className="icon"
                            onMouseEnter={() => setProfileOpen(true)}
                            onClick={() => setProfileOpen(false)}


                        />
                        <span className="profile-greeting">
                            {users ? `Hi, ${users.f_name}` : 'Hi, Guest'}
                        </span>
                        {profileOpen && (
                            <ul className='profile-menu' onMouseLeave={() => setProfileOpen(false)}>
                                {user ? (
                                    <li onClick={handleLogout}>Logout</li>
                                ) : (
                                    <li onClick={handleLogin}>Login</li>
                                )}
                            </ul>
                        )}

                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
