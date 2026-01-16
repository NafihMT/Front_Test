import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import '../ProductCard/ProductCard.css';
import ProductPagination from '../ProductPagination/ProductPagination';
import '../ProductPagination/ProductPagination.css'
import EditProductModal from '../EditProduct/EditProduct';
import '../EditProduct/EditProduct.css'
import { toast } from 'react-toastify';

function ProductList({ searchTerm = "" }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(3);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3001/products');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // --- Pagination Logic ---
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleEdit = (id) => {
        const productToEdit = products.find(p => p.id === id);
        setEditingProduct(productToEdit);
        setIsModalOpen(true);
    };

    const handleUpdateProduct = async (updatedProduct) => {
        try {
            const response = await fetch(`http://localhost:3001/products/${updatedProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct),
            });
            if (!response.ok) throw new Error('Failed to update product.');

            setProducts(products.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
            toast.success('Product updated successfully!');
            setIsModalOpen(false);
            setEditingProduct(null);
        } catch (err) {
            toast.error(err.message);
        }
    };


    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`http://localhost:3001/products/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete.');

                setProducts(products.filter(p => p.id !== id));
                toast.success('Product deleted successfully!');
            } catch (err) {
                toast.error(err.message);
            }
        }
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="product-list-container">
            {currentProducts.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={() => handleEdit(product.id)}
                    onDelete={() => handleDelete(product.id)}
                />
            ))}

            <ProductPagination
                productsPerPage={productsPerPage}
                totalProducts={filteredProducts.length}
                paginate={paginate}
                currentPage={currentPage}
            />

            {isModalOpen && (
                <EditProductModal
                    product={editingProduct}
                    onSave={handleUpdateProduct}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}

export default ProductList;