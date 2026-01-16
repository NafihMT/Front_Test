import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import OrderList from './OrderList/OrderList';
import ProductPagination from '../Products/ProductPagination/ProductPagination'; 
import './OrderManage.css';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(5); 

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:5298/api/Order');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const filteredOrders = orders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="orders-view">
            <div className="orders-header">
                <h2 className='products-title'>Order Management</h2>
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