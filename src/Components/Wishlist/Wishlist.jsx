import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext/CartContext';
import NavBar from '../NavBar/Navbar';
import './Wishlist.css';
import { toast } from 'react-toastify';

function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user, userLoaded, setCart, setWishlist } = useContext(CartContext);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const API_URL = "http://localhost:5000/api";
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        if (!userLoaded) return;
        if (!user) {
            navigate('/login');
            return;
        }

        api.get(`${API_URL}/wishlist`, { headers })
            .then(res => {
                setWishlistItems(res.data.data || []);
                setIsLoading(false);
            })
            .catch(() => {
                toast.error("Error loading wishlist");
                setIsLoading(false);
            });
    }, [user, userLoaded, navigate]);

    const handleRemoveFromWishlist = async (id, silent = false) => {
        try {
            await api.delete(`${API_URL}/wishlist/remove/${id}`, { headers });
            const updatedList = wishlistItems.filter(item => item.id !== id);
            setWishlistItems(updatedList);
            setWishlist(updatedList); 
            
            // Only show toast if silent is false
            if (!silent) {
                toast.info("Removed from wishlist");
            }
        } catch {
            toast.error("Failed to remove item");
        }
    };

    const handleAddToCart = async (item) => {
        try {
            const res = await api.post(
                `${API_URL}/cart/${item.productId}`, 
                { quantity: 1 }, 
                { headers }
            );
            
            if (res.data.data) {
                setCart(prev => [...prev, res.data.data]);
            }
            
            // 2. Call remove with 'true' to suppress the "Removed" toast
            await handleRemoveFromWishlist(item.id, true);
            
            toast.success(`${item.product?.name} moved to cart!`);
        } catch (error) {
            toast.error("Error moving item to cart");
        }
    };

    if (isLoading) return <div className="wishlist-container">Loading...</div>;

    return (
        <div className='wishlist-main-container'>
            <NavBar />
            <div className="wishlist-container" style={{ paddingTop: '100px' }}>
                <h1 className="wishlist-title">My Wishlist</h1>

                {wishlistItems.length === 0 ? (
                    <div className="empty-wishlist">
                        <p>Your wishlist is empty.</p>
                        <button onClick={() => navigate('/store')} className="continue-shopping-btn">
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="wishlist-table">
                        <div className="wishlist-header">
                            <span className="header-product">Product Name</span>
                            <span className="header-price">Unit Price</span>
                            <span className="header-actions">Actions</span>
                        </div>
                        <div className="wishlist-items">
                            {wishlistItems.map(item => (
                                <div className="wishlist-item" key={item.id}>
                                    <div className="item-product">
                                        <button onClick={() => handleRemoveFromWishlist(item.id)} className="remove-btn">×</button>
                                        <img 
                                            src={item.product?.image || item.product?.imageUrl} 
                                            alt={item.product?.name} 
                                            className="product-image" 
                                        />
                                        <span>{item.product?.name}</span>
                                    </div>
                                    <div className="item-price">
                                        <span>₹{(item.product?.price || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="item-actions">
                                        <button onClick={() => handleAddToCart(item)} className="add-to-cart-btn">
                                            ADD TO CART
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Wishlist;