import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../CartContext/CartContext';
import './Orders.css';
import NavBar from '../NavBar/Navbar';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(CartContext);

    useEffect(() => {
        if (!user) return;

        axios.get(`http://localhost:5298/api/Order/my-orders`)
            .then(response => {
                const orderData = response.data.data;
                setOrders(orderData);
            })
            .catch(error => console.error("Error fetching orders:", error))
            .finally(() => setIsLoading(false));
    }, [user]);

 

    if (isLoading) {
        return <div className="history-container loading">Loading order history...</div>;
    }

    return (
        <div className="history-container">
            <NavBar />
            <h1 className="history-title">ORDER HISTORY</h1>
            {orders.length === 0 ? (
                <p className="no-orders-message">You have no past orders.</p>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div className="order-card" key={order.id}>
                            <div className="order-header">
                                <div className="order-info">
                                    <p className="order-number">{order.orderNumber}</p>
                                    <p className="order-date">
                                        {order.orderedOn ? new Date(order.orderedOn).toLocaleString() : ""}
                                    </p>
                                </div>
                                <div className="order-meta">
                                    <span>Status: {order.status || "Delivered"}</span>
                                </div>
                            </div>
                            <div className="order-details-grid">
                                <div className="detail-header">PRODUCT</div>
                                <div className="detail-header">QUANTITY</div>
                                <div className="detail-header">PRICE</div>
                                {order.items.map(item => (
                                    <React.Fragment key={item.productId}>
                                        <div className="detail-item">{item.name}</div>
                                        <div className="detail-item">{item.quantity}</div>
                                        <div className="detail-item">₹{item.price.toFixed(2)}</div>
                                    </React.Fragment>
                                ))}
                            </div>
                            <div className="order-total">
                                <span>GRAND TOTAL</span>
                                <p>₹{order.totalAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Orders;