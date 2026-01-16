import React from 'react';
import './OrderList.css';

const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;

function OrderList({ orders, loading, error }) {
    if (loading) return <div>Loading orders...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="order-table">
            <div className="order-table-header">
                <div>Order ID</div>
                <div>Date</div>
                <div>Address</div>
                <div>Items</div>
                <div>Total</div>
                <div>Status</div>
            </div>

            {orders.map(order => (
                <div className="order-table-row" key={order.id}>
                    <div className="order-id">#{order.id}</div>
                    <div>{formatDate(order.orderedOn)}</div>
                    <div className="order-address">
                        <strong>{order.shippingAddress.f_name}</strong>
                        <p>{order.shippingAddress.address}, {order.shippingAddress.city}, <br />{order.shippingAddress.zipCode}</p>
                    </div>
                    <div className="order-items">
                        {order.items.map((item, index) => (
                            <span key={index}>{item.name} (x{item.quantity})</span>
                        ))}
                    </div>
                    <div>{formatCurrency(order.totalAmount)}</div>
                    <div>
                        <span className={`status-badge status--${order.status.toLowerCase()}`}>
                            {order.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default OrderList;