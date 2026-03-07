import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react'; 
import NavBar from '../NavBar/Navbar'; 
import './Order.css';   


function Order() {
    const navigate = useNavigate();

    return (
        <>
            <NavBar />
            <div className="confirmation-container">
                <div className="confirmation-card">
                    <div className="checkmark-circle">
                        <Check color="white" size={40} strokeWidth={3} />
                    </div>

                    <h1 className="confirmation-title">Thank you for ordering!</h1>
                    <p className="confirmation-message">Visit Again</p>

                    <div className="confirmation-actions">
                        <button
                            onClick={() => navigate('/orders')} 
                            className="view-order-btn"
                        >
                            View Order
                        </button>
                        <button
                            onClick={() => navigate('/store')}
                            className="continue-shopping-btn"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Order;