import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext/CartContext';
import NavBar from '../NavBar/Navbar';
import './Wishlist.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user, setCart, userLoaded } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoaded) return;
        if (!user) {
            toast.error("Please log in to see your wishlist.");
            navigate('/login');
            return;
        }

        axios.get(`http://localhost:5298/api/Wishlist?userId=${user.id}`)
            .then(response => {
                setWishlistItems(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching wishlist:", error);
                setIsLoading(false);
            });
    }, [user, navigate]);

    // Replace handleRemove
    const handleRemoveFromWishlist = async (wishlistItemId) => {
        try {
            // Updated route to match .NET Controller
            await axios.delete(`http://localhost:5298/api/Wishlist/remove/${wishlistItemId}`);
            setWishlistItems(prev => prev.filter(item => item.id !== wishlistItemId));
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    // Replace handleAddToCart
    const handleAddToCart = async (item) => {
        try {
            // api/Cart/add usually takes { productId, quantity }
            await axios.post("http://localhost:5298/api/Cart/add", {
                productId: item.productId,
                quantity: 1
            });
            await handleRemoveFromWishlist(item.id);
            toast.success("Moved to cart!");
        } catch (error) {
            toast.error("Error moving item");
        }
    };

    if (isLoading) {
        return <div className="wishlist-container"><p>Loading your wishlist...</p></div>;
    }

    return (
        <div className='wishlist-main-container'>
            <NavBar />
            <div className="wishlist-container">
                <h1 className="wishlist-title">My Wishlist</h1>

                {wishlistItems.length === 0 ? (
                    <div className="empty-wishlist">
                        <p>Your wishlist is currently empty.</p>
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
                                        <img src={item.image} alt={item.name} className="product-image" />
                                        <span>{item.name}</span>
                                    </div>
                                    <div className="item-price">
                                        <span>₹{item.price.toFixed(2)}</span>
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