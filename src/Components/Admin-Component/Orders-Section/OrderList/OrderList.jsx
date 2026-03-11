import React from 'react';
import './OrderList.css';

const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;

// Added onStatusChange prop
function OrderList({ orders, loading, error, onStatusChange }) {
    if (loading) return <div>Loading orders...</div>;
    if (error) return <div>Error: {error}</div>;

    // Helper to map string status to enum integer value
    const getStatusValue = (statusStr) => {
        switch(statusStr) {
            case "Pending": return 0;
            case "Processing": return 1;
            case "Shipped": return 2;
            case "Delivered": return 3;
            case "Cancelled": return 4;
            default: return 0;
        }
    };

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
                    
                    {/* FIX: Change orderedOn to createdAt */}
                    <div>{formatDate(order.createdAt)}</div>
                    
                    <div className="order-address">
                        {/* FIX: Safely check for address */}
                        {order.shippingAddress ? (
                            <>
                                <strong>{order.shippingAddress.f_name}</strong>
                                <p>{order.shippingAddress.address}, {order.shippingAddress.city}, <br />{order.shippingAddress.zipCode}</p>
                            </>
                        ) : 'No Address Provided'}
                    </div>
                    
                    <div className="order-items">
                        {/* FIX: Change item.name to item.productName */}
                        {order.items.map((item, index) => (
                            <div key={index}>{item.productName} (x{item.quantity})</div>
                        ))}
                    </div>
                    
                    <div>{formatCurrency(order.totalAmount)}</div>
                    
                    <div>
                        {/* NEW: Status Dropdown */}
                        <select 
                            className={`status-badge status--${order.status?.toLowerCase()}`}
                            value={getStatusValue(order.status)}
                            onChange={(e) => {
                                const newText = e.target.options[e.target.selectedIndex].text;
                                onStatusChange(order.id, e.target.value, newText);
                            }}
                        >
                            <option value={0}>Pending</option>
                            <option value={1}>Processing</option>
                            <option value={2}>Shipped</option>
                            <option value={3}>Delivered</option>
                            <option value={4}>Cancelled</option>
                        </select>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default OrderList;