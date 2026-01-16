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

const API_BASE_URL = "http://localhost:5298/api"; 

function getCategoryButtons(products) {
    const categories = new Set();
    products.forEach(p => {
        if (p.categoryName) {
            const key = p.categoryName.trim();
            categories.add(key.replace(/\s+$/, ""));
        }
    });
    return Array.from(categories);
}

function Store() {
    const { cart, setCart, user } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [sortOption, setSortOption] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [categoryButtons, setCategoryButtons] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch Products from .NET Web API
    useEffect(() => {
        axios.get(`${API_BASE_URL}/Product`) //
            .then(res => {
                // Accessing data from the structured ApiResponse
                const productList = res.data.data; 
                setProducts(productList);
                setCategoryButtons(getCategoryButtons(productList));
            })
            .catch(err => console.error("Error fetching products:", err));
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cat = params.get("category");
        const search = params.get("search") || "";
        setSearchTerm(search);

        if (cat && (cat === "All" || categoryButtons.includes(cat))) {
            setSelectedCategory(cat);
        } else {
            setSelectedCategory("All");
        }
    }, [location.search, categoryButtons]);

    // Fetch Wishlist from .NET Web API
    useEffect(() => {
        if (user) {
            axios.get(`${API_BASE_URL}/Wishlist`) //
                .then(res => setWishlistItems(res.data.data))
                .catch(err => console.error("Error fetching wishlist:", err));
        }
    }, [user]);

    const handleCategorySelect = (category) => {
        navigate(`/store?category=${encodeURIComponent(category)}`);
    };

    const handleToggleWishlist = async (product) => {
        if (!user) {
            toast.error("Please log in to manage your wishlist.");
            return;
        }

        const existingItem = wishlistItems.find(item => item.productId === product.id);
        try {
            if (existingItem) {
                // Remove using the ID from the backend WishlistItemDto
                await axios.delete(`${API_BASE_URL}/Wishlist/remove/${existingItem.id}`); 
                setWishlistItems(prev => prev.filter(item => item.id !== existingItem.id));
                toast.info("Removed from wishlist");
            } else {
                // Add using AddToWishlistDto structure
                const response = await axios.post(`${API_BASE_URL}/Wishlist/add`, { 
                    productId: product.id 
                });
                setWishlistItems(prev => [...prev, response.data.data]);
                toast.success("Added to wishlist");
            }
        } catch (error) {
            console.error("Error updating wishlist:", error);
            toast.error("Failed to update wishlist");
        }
    };

    const addToCart = async (product) => {
        if (!user) {
            toast.error("Please login to add items to cart!");
            return;
        }
        try {
            // Add using AddToCartDto structure
            const response = await axios.post(`${API_BASE_URL}/Cart/add`, { 
                productId: product.id, 
                quantity: 1 
            });
            
            // Your backend handles checking for existing items in the CartService
            setCart(prev => {
                const existing = prev.find(item => item.productId === product.id);
                if (existing) {
                    return prev.map(item => 
                        item.productId === product.id ? response.data.data : item
                    );
                }
                return [...prev, response.data.data];
            });
            toast.success(`${product.name} added to cart!`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error adding to cart");
        }
    };

    const getSortedProducts = () => {
        let filtered = [...products];
        if (selectedCategory !== "All") {
            filtered = filtered.filter(
                p => p.categoryName && p.categoryName.trim() === selectedCategory
            );
        }
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(
                p =>
                    p.name.toLowerCase().includes(searchLower) ||
                    (p.description && p.description.toLowerCase().includes(searchLower))
            );
        }
        if (sortOption === "priceLowHigh") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === "priceHighLow") {
            filtered.sort((a, b) => b.price - a.price);
        }
        return filtered;
    };

    return (
        <div>
            <div className="store-container">
                <NavBar
                    variant="store"
                    cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
                    wishlistCount={wishlistItems.length}
                />
                <h1 className="store-title" style={{ fontFamily: "fantasy", color: "rgba(67, 64, 64, 1)" }}>Master Head Drops</h1>
                <div style={{ marginBottom: 20, display: "flex", gap: 10, justifyContent: "center" }}>
                    <div className="btn-category">
                        <button className="all-cat" onClick={() => handleCategorySelect("All")}>All </button>
                        {categoryButtons.map(cat => (
                            <button key={cat} className="all-cat" onClick={() => handleCategorySelect(cat)}>{cat}</button>
                        ))}
                    </div>
                    <select
                        value={sortOption}
                        onChange={e => setSortOption(e.target.value)}
                        className="sort-select"
                        style={{
                            position:"relative",
                            left:"20%",
                            padding: "10px 18px",
                            borderRadius: "6px",
                            border: "1px solid #bbb",
                            fontSize: "16px",
                            minWidth: "180px",
                            background: "#fff"
                        }}
                    >
                        <option value="">Sort Products</option>
                        <option value="priceLowHigh">Price: Low to High</option>
                        <option value="priceHighLow">Price: High to Low</option>
                    </select>
                </div>

                <div className="helmets-grid">
                    {getSortedProducts().map(product => (
                        <div className="helmet-card" key={product.id} >
                            <div
                                className="wishlist-icon"
                                onClick={() => handleToggleWishlist(product)}
                            >
                                <FaHeart color={wishlistItems.some(item => item.productId === product.id) ? "red" : "#ddd"} />
                            </div>
                            <img src={product.imageUrl} alt={product.name} className="helmet-img" onClick={() => navigate(`/products/${product.id}`)}/>
                            <h2 onClick={() => navigate(`/products/${product.id}`)} style={{cursor:"pointer"}}>{product.name}</h2>
                            <p>₹{product.price}</p>
                            <p className="helmet-category">{product.categoryName}</p>
                            <button className="add-to-cart-button" onClick={() => addToCart(product)}>
                                <ShoppingCart size={20} /> ADD TO CART
                            </button>
                            <button
                                className="details-btn"
                                onClick={() => navigate(`/products/${product.id}`)}
                            >
                                Details
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Store;