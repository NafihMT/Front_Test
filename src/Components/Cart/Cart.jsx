import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext/CartContext';
import axios from 'axios';
import './Cart.css';
import NavBar from '../NavBar/Navbar';
import { toast } from 'react-toastify';

const MAX_QUANTITY = 10;

function Cart() {
    const API_URL = "http://localhost:5000/api/cart";
    const { cart, setCart, user } = useContext(CartContext);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        if (user) {
            axios.get(API_URL, getAuthHeaders())
                .then(res => setCart(res.data.data || []))
                .catch(() => toast.error("Failed to load cart items."));
        }
    }, [user]);

    const handleUpdateQuantity = async (item, newQuantity) => {
        if (newQuantity < 1 || newQuantity > MAX_QUANTITY) return;

        const originalCart = [...cart];
        setCart(prev => prev.map(i =>
            i.id === item.id ? { ...i, quantity: newQuantity } : i
        ));

        try {
            const res = await axios.put(`${API_URL}/update/${item.id}`,
                { quantity: newQuantity },
                getAuthHeaders()
            );

            if (res.data?.data) {
                setCart(prev => prev.map(i => i.id === item.id ? res.data.data : i));
            }
        } catch (error) {
            setCart(originalCart);
            toast.error("Failed to update server.");
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await axios.delete(`${API_URL}/remove/${itemId}`, getAuthHeaders());
            setCart(prev => prev.filter(item => item.id !== itemId));
            toast.success("Item removed");
        } catch (error) {
            toast.error("Failed to remove item.");
        }
    };

    const subtotal = cart.reduce((total, item) => {
        // Safety check: Ensure item and price exist before multiplying
        if (!item || typeof item.price === 'undefined') return total;
        return total + (item.price * item.quantity);
    }, 0);

    if (!cart || cart.length === 0) {
        return (
            <div className="cart-container empty-cart-wrapper">
                <NavBar />
                <div className="empty-cart-content">
                    <h1 className="cart-title">Shopping Cart</h1>
                    <p>Your cart is currently empty.</p>
                    <button onClick={() => navigate('/store')} className="checkout-btn" style={{ width: '200px' }}>
                        Go to Store
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <NavBar />

            <div className="cart-header">
                <h1>Shopping Cart</h1>
                <span>{cart.length} Items</span>
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
                            <img src={item.imageUrl || item.image} alt={item.name} />
                            <div className="item-details">
                                <span className="item-name">{item.name}</span>
                                <span className="item-category">Category: {item.categoryName || 'Helmet'}</span>
                                <button onClick={() => handleRemoveItem(item.id)} className="remove-btn-text">Remove</button>
                            </div>
                        </div>

                        <div className="item-quantity">
                            <button onClick={() => handleUpdateQuantity(item, item.quantity - 1)}>-</button>
                            <input type="text" value={item.quantity} readOnly />
                            <button onClick={() => handleUpdateQuantity(item, item.quantity + 1)}>+</button>
                        </div>

                        <div className="item-price">₹{item.price}</div>

                        <div className="item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                ))}
            </div>

            <div className="cart-footer">
                <button onClick={() => navigate('/store')} className="continue-shopping-btn">
                    ← CONTINUE SHOPPING
                </button>
                <div className="cart-summary">
                    <div className="summary-row total-row">
                        <span>Grand Total</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Cart;