import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./ProductDesc.css";
import { Heart, ShoppingCart } from 'lucide-react';
import NavBar from '../NavBar/Navbar';
import { CartContext } from "../CartContext/CartContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = "http://localhost:5000/api";

function ProductDesc() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const { user, setCart, wishlist, setWishlist } = useContext(CartContext);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    useEffect(() => {
        axios.get(`${API_BASE_URL}/product/${id}`)
            .then(res => {
                setProduct(res.data.data || res.data);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setProduct(null);
            });
    }, [id]);

    if (!product) {
        return <div className="loading-container">Loading helmet details...</div>;
    }

    const handleDecrement = () => {
        setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    };

    const handleIncrement = () => {
        setQuantity(prev => (prev < 10 ? prev + 1 : 10));
    };

    const handleToggleWishlist = async () => {
        if (!user) {
            toast.error("Please log in to manage your wishlist.");
            return;
        }

        const existingItem = wishlist.find(item => item.productId === product.id);
        try {
            if (existingItem) {
                await axios.delete(`${API_BASE_URL}/wishlist/remove/${existingItem.id}`, getAuthHeaders());
                setWishlist(prev => prev.filter(item => item.id !== existingItem.id));
                toast.info("Removed from wishlist");
            } else {
                // Fix: Check your Wishlist endpoint. If it's /api/wishlist/{id}
                const response = await axios.post(`${API_BASE_URL}/wishlist/${product.id}`, {}, getAuthHeaders());
                setWishlist(prev => [...prev, response.data.data]);
                toast.success("Added to wishlist");
            }
        } catch (error) {
            toast.error("Failed to update wishlist");
        }
    };

    const addToCart = async (isBuyNow = false) => {
        if (!user) {
            toast.error("Please login to add items to cart!");
            return;
        }

        try {
            // FIX: Remove '/add' from the URL. 
            // The backend expects /api/cart/{productId}
            await axios.post(
                `${API_BASE_URL}/cart/${product.id}`,
                { quantity: Number(quantity) },
                getAuthHeaders()
            );

            // Sync global cart state to update Navbar count
            const resCart = await axios.get(`${API_BASE_URL}/cart`, getAuthHeaders());
            setCart(resCart.data.data || []);

            toast.success(`${product.name} added to cart!`);

            if (isBuyNow) {
                navigate('/cart');
            }
        } catch (error) {
            console.error("Cart Error Details:", error.response?.data);

            // Handle specific error messages from the backend
            const errorMsg = error.response?.data?.message || "Error adding to cart";
            toast.error(errorMsg);
        }
    };

    return (
        <div className="product-main-container">
            <NavBar />
            <div className="main-product-card">
                <div className="product-card-left">
                    <img
                        src={product.imageUrl || product.image}
                        alt={product.name}
                        className="product-image"
                    />
                </div>

                <div className="product-card-right">
                    <button className="wishlist-button" onClick={handleToggleWishlist}>
                        <Heart
                            size={24}
                            fill={wishlist.some(item => item.productId === product.id) ? "red" : "none"}
                            color={wishlist.some(item => item.productId === product.id) ? "red" : "currentColor"}
                        />
                    </button>

                    <div className="product-details-section">
                        <h1>{product.name}</h1>
                        <p className="product-category">
                            {/* FIX: Access .name to avoid "Objects are not valid as React child" error */}
                            {(product.category?.name || product.categoryName || "Premium")} Helmet
                        </p>
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">
                            ₹{product.price}
                            <span className="taxes">(INCL. OF ALL TAXES)</span>
                        </p>

                        <div className="actions-container">
                            <div className="quantity-selector">
                                <button onClick={handleDecrement}>-</button>
                                <input type="text" value={quantity} readOnly />
                                <button onClick={handleIncrement}>+</button>
                            </div>
                            <button className="add-to-cart-button" onClick={() => addToCart(false)}>
                                <ShoppingCart size={20} /> ADD TO CART
                            </button>
                            <button className="buy-button" onClick={() => addToCart(true)}>
                                BUY NOW
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDesc;