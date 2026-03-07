import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'react-toastify';
import { CartContext } from '../CartContext/CartContext';
import './Checkout.css';
import NavBar from '../NavBar/Navbar';

const API_BASE_URL = "http://localhost:5000/api";
function Checkout() {
    const { cart, setCart, user } = useContext(CartContext);
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const [shippingInfo, setShippingInfo] = useState({
        firstName: '', lastName: '', address: '', zipCode: '', city: '', phone: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const token = localStorage.getItem("token");

            const payload = {
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            };

            await api.post(
                `${API_BASE_URL}/order`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCart([]);
            toast.success("Order placed successfully!");
            navigate('/order');

        } catch (error) {
            console.error(error.response?.data);
            toast.error(error.response?.data?.message || "Failed to place order.");
        } finally {
            setIsProcessing(false);
        }
    };

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingHandling = subtotal > 0 ? 49.99 : 0;
    const orderTotal = subtotal + shippingHandling;

    return (
        <>
            <NavBar />
            <div className="checkout-page-wrapper">
                <div className="checkout-container">
                    <main className="checkout-main">
                        <div className="checkout-page-header">
                            <h2>Checkout</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="shipping-form">
                            <h3>Address</h3>
                            <div className="form-row">
                                <div className="form-group"><label>First Name <span>required</span></label><input type="text" name="firstName" onChange={handleInputChange} required /></div>
                                <div className="form-group"><label>Last Name <span>required</span></label><input type="text" name="lastName" onChange={handleInputChange} required /></div>
                            </div>
                            <div className="form-group"><label>Street Address <span>required</span></label><input type="text" name="address" onChange={handleInputChange} required /></div>
                            <div className="form-row">
                                <div className="form-group"><label>Zip Code <span>required</span></label><input type="text" name="zipCode" onChange={handleInputChange} required /></div>
                                <div className="form-group"><label>City <span>required</span></label><input type="text" name="city" onChange={handleInputChange} required /></div>
                            </div>
                            <div className="form-group"><label>Phone Number <span>required</span></label><input type="tel" name="phone" onChange={handleInputChange} required /></div>

                            <button type="submit" className="continue-btn" disabled={isProcessing}>
                                {isProcessing ? 'Processing...' : 'Confirm Order'}
                            </button>
                        </form>
                    </main>

                    <aside className="checkout-sidebar">
                        <div className="order-summary">
                            <div className="summary-header">
                                <h3>Order Summary</h3>
                                <button onClick={() => navigate('/cart')} className="edit-cart-btn">Edit cart</button>
                            </div>
                            <div className="summary-line"><span>Merchandise:</span><span>₹{subtotal.toFixed(2)}</span></div>
                            <div className="summary-line"><span>Shipping & Handling:</span><span>₹{shippingHandling.toFixed(2)}</span></div>
                            <hr />
                            <div className="summary-line total"><span>Order Total:</span><span>₹{orderTotal.toFixed(2)}</span></div>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}

export default Checkout;