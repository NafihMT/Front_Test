import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext/CartContext';
import axios from 'axios';
import './Cart.css';
import NavBar from '../NavBar/Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MAX_QUANTITY = 10;

function Cart() {
    const API_URL = "http://localhost:5000/api";
    const { cart, setCart, user } = useContext(CartContext);
    const navigate = useNavigate();

    // Retrieve the token for authorized backend calls
    const token = localStorage.getItem("token");

    const cartCount = cart.length;
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // Helper for headers
    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${token}` }
    });

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1 || newQuantity > MAX_QUANTITY) return;
        try {
            // FIX: Added Auth headers and matched .NET route (usually lowercase 'cart')
            await axios.put(`${API_URL}/cart/update/${itemId}`, 
                { quantity: newQuantity }, 
                getAuthHeaders()
            );
            
            setCart(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
        } catch (error) {
            // FIX: Dynamic error message from ApiResponse
            const msg = error.response?.data?.message || "Failed to update quantity.";
            toast.error(msg);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            // FIX: Added Auth headers
            await axios.delete(`${API_URL}/cart/remove/${itemId}`, getAuthHeaders());
            setCart(prev => prev.filter(item => item.id !== itemId));
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to remove item.";
            toast.error(msg);
        }
    };

    const handleCheckout = () => {
        if (!user) {
            toast.error("Please log in to proceed!");
            return;
        }
        if (cart.length === 0) {
            toast.info("Your cart is empty.");
            return;
        }
        navigate('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div className="cart-container empty-cart" style={{ paddingTop: "100px" }}>
                <NavBar />
                <h1>Shopping Cart</h1>
                <p>Your cart is empty.</p>
                <button onClick={() => navigate('/store')} className="continue-shopping-btn">
                    ← Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <NavBar />
            <div className="cart-header">
                <h1>Shopping Cart</h1>
                <span>{cartCount} Items</span>
            </div>
            <div className="cart-table-header">
                <span className="header-product">PRODUCT DETAILS</span>
                <span className="header-quantity">QUANTITY</span>
                <span className="header-price">PRICE</span>
                <span className="header-total">TOTAL</span>
            </div>

            <div className="cart-items">
                {cart.map(item => (
                    <div className="cart-item" key={item.id}>
                        <div className="item-product">
                            {/* FIX: Backend property is imageUrl (camelCase JSON) */}
                            <img src={item.imageUrl || item.image} alt={item.name} />
                            <div className="item-details">
                                <span className="item-name">{item.name}</span>
                                {/* FIX: Handled dynamic backend category property */}
                                <span className="item-category">{item.categoryName || item.category}</span>
                                <button onClick={() => handleRemoveItem(item.id)} className="remove-btn">Remove</button>
                            </div>
                        </div>
                        <div className="item-quantity">
                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                            <input type="text" value={item.quantity} readOnly />
                            <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= MAX_QUANTITY}
                            >
                                +
                            </button>
                        </div>
                        <div className="item-price">₹{item.price.toFixed(2)}</div>
                        <div className="item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                ))}
            </div>

            <div className="cart-footer">
                <button onClick={() => navigate('/store')} className="continue-shopping-btn">
                    ← Continue Shopping
                </button>
                <div className="cart-summary">
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>FREE</span>
                    </div>
                    <div className="summary-row total-row">
                        <span>Total</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn" onClick={handleCheckout}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Cart;