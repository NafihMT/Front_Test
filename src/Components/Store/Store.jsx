import React, { useEffect, useState, useContext } from 'react';
import NavBar from '../NavBar/Navbar';
import axios from "axios";
import { CartContext } from "../CartContext/CartContext";
import "./Store.css";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHeart } from "react-icons/fa";
import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = "http://localhost:5000/api";

function Store() {
    const { cart, setCart, user, setWishlist, wishlist } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [sortOption, setSortOption] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    // Helper for Authorization Headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    // 1. Fetch Products (Updated to handle Search and Category from URL)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryName = params.get("category");
        const searchParam = params.get("search");

        // Sync local search term state with URL for the getSortedProducts function
        setSearchTerm(searchParam || "");

        let fetchUrl = `${API_BASE_URL}/product/GetAll-Product`;

        // If a specific category is selected, use the category endpoint
        if (categoryName && categoryName !== "All") {
            fetchUrl = `${API_BASE_URL}/product/category/${encodeURIComponent(categoryName)}`;
        }

        axios.get(fetchUrl)
            .then(res => {
                // Ensure we handle both direct arrays and ApiResponse wrapped data
                const data = res.data.data || res.data;
                setProducts(data);
            })
            .catch(err => console.error("Error fetching products:", err));
    }, [location.search]); // Re-runs whenever the URL (category or search) changes

    // 2. Fetch Wishlist
    useEffect(() => {
        if (user) {
            axios.get(`${API_BASE_URL}/wishlist`, getAuthHeaders())
                .then(res => setWishlist(res.data.data || []))
                .catch(err => console.error("Error fetching wishlist:", err));
        }
    }, [user, setWishlist]);

    const handleToggleWishlist = async (product) => {
        if (!user) {
            toast.error("Please log in to manage your wishlist.");
            return;
        }

        // Use context state 'wishlist' to check for existing productId
        const existingItem = wishlist.find(item => item.productId === product.id);

        try {
            if (existingItem) {
                await axios.delete(`${API_BASE_URL}/wishlist/remove/${existingItem.id}`, getAuthHeaders());
                setWishlist(prev => prev.filter(item => item.id !== existingItem.id));
                toast.info("Removed from wishlist");
            } else {
                const response = await axios.post(`${API_BASE_URL}/wishlist/${product.id}`, {}, getAuthHeaders());
                // Sync with backend response data
                setWishlist(prev => [...prev, response.data.data]);
                toast.success("Added to wishlist");
            }
        } catch (error) {
            toast.error("Failed to update wishlist");
        }
    };

    const addToCart = async (product) => {
        if (!user) {
            toast.error("Please login to add items to cart!");
            return;
        }
        try {
            await axios.post(`${API_BASE_URL}/cart/${product.id}`, { quantity: 1 }, getAuthHeaders());
            const res = await axios.get(`${API_BASE_URL}/cart`, getAuthHeaders());
            setCart(res.data.data);
            toast.success(`${product.name} added to cart!`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error adding to cart");
        }
    };

    const getSortedProducts = () => {
        let filtered = [...products];

        // Search filtering (fallback for local filtering if needed)
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(p => p.name.toLowerCase().includes(searchLower));
        }

        // Sorting Logic
        if (sortOption === "priceLowHigh") filtered.sort((a, b) => a.price - b.price);
        else if (sortOption === "priceHighLow") filtered.sort((a, b) => b.price - a.price);

        return filtered;
    };

    return (
        <div className="store-container">
            <NavBar />
            <div style={{ paddingTop: '100px' }}> {/* Space for fixed Navbar */}
                <h1 className="store-title">Master Head Drops</h1>

                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <select
                        value={sortOption}
                        onChange={e => setSortOption(e.target.value)}
                        className="sort-select"
                    >
                        <option value="">Sort Products</option>
                        <option value="priceLowHigh">Price: Low to High</option>
                        <option value="priceHighLow">Price: High to Low</option>
                    </select>
                </div>

                <div className="helmets-grid">
                    {getSortedProducts().length > 0 ? (
                        getSortedProducts().map(product => (
                            <div className="helmet-card" key={product.id}>
                                <div className="wishlist-icon" onClick={() => handleToggleWishlist(product)}>
                                    <FaHeart color={wishlist.some(item => item.productId === product.id) ? "red" : "#ddd"} />
                                </div>
                                <img
                                    src={product.imageUrl || product.Image}
                                    alt={product.name}
                                    className="helmet-img"
                                    onClick={() => navigate(`/products/${product.id}`)}
                                />
                                <h2 onClick={() => navigate(`/products/${product.id}`)} style={{ cursor: 'pointer' }}>
                                    {product.name}
                                </h2>
                                <p>₹{product.price}</p>
                                <button className="add-to-cart-button" onClick={() => addToCart(product)}>
                                    <ShoppingCart size={20} /> ADD TO CART
                                </button>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>No products found matching your criteria.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Store;