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

            // if ApiResponse wrapper
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

    const filteredOrders = orders.filter(order =>
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="orders-view">

            <div className="orders-header">
                <h2 className='products-title'>Order Management</h2>
                <div className="search-container">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by order number..."
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