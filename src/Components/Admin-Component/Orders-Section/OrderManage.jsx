import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import OrderList from './OrderList/OrderList';
import ProductPagination from '../Products/ProductPagination/ProductPagination';
import './OrderManage.css';

const API_BASE_URL = "http://localhost:5000/api";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(5);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_BASE_URL}/order`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok)
                throw new Error("Failed to fetch orders");

            const data = await response.json();
            setOrders(data.data ?? data ?? []);

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // FIX: Filter by 'id', not 'orderNumber'
    const filteredOrders = orders.filter(order =>
        order.id?.toString().includes(searchTerm)
    );

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // NEW: Handle Status Updates
    const handleStatusChange = async (orderId, newStatusValue, newStatusText) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/order/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                // Send integer value of enum to backend
                body: JSON.stringify({ status: parseInt(newStatusValue) })
            });

            if (!response.ok) throw new Error("Failed to update status");

            // Update UI state locally
            setOrders(prevOrders => prevOrders.map(order =>
                order.id === orderId ? { ...order, status: newStatusText } : order
            ));

        } catch (err) {
            console.error(err);
            alert("Error updating order status");
        }
    };

    return (
        <div className="orders-view">
            <div className="orders-header">
                <h2 className='products-title'>Order Management</h2>
                {/* <div className="search-container">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by order ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div> */}
                <div className="search-container">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by order ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="order-list-container">
                <OrderList
                    orders={currentOrders}
                    loading={loading}
                    error={error}
                    onStatusChange={handleStatusChange}
                />
            </div>

            <ProductPagination
                productsPerPage={ordersPerPage}
                totalProducts={filteredOrders.length}
                paginate={paginate}
                currentPage={currentPage}
            />
        </div>
    );
}

export default Orders;