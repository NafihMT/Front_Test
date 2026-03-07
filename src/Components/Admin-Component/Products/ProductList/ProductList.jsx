import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import ProductPagination from '../ProductPagination/ProductPagination';
import EditProductModal from '../EditProduct/EditProduct';
import { toast } from 'react-toastify';
import './ProductList.css';

function ProductList({
    searchTerm = "",
    products,
    setProducts,
    loading,
    error
}) {

    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(3);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, products]);

    const filteredProducts = (products ?? []).filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/product/${updatedProduct.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedProduct),
                }
            );

            if (!response.ok)
                throw new Error('Failed to update product.');

            toast.success('Product updated successfully!');

            // 🔥 IMPORTANT: re-fetch full product list
            const refresh = await fetch("http://localhost:5000/api/product/GetAll-Product");
            const freshData = await refresh.json();

            setProducts(freshData);

            setIsModalOpen(false);
            setEditingProduct(null);

        } catch (err) {
            console.error(err);
            toast.error("Update failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?'))
            return;

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/product/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok)
                throw new Error('Failed to delete.');

            // Remove from UI immediately
            setProducts(prev => prev.filter(p => p.id !== id));

            toast.success('Product deleted successfully!');

        } catch (err) {
            console.error(err);
            toast.error("Unauthorized or server error");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="product-list-container">

            {filteredProducts.length === 0 ? (
                <div className="no-results">
                    {searchTerm
                        ? `No products found for "${searchTerm}"`
                        : "No products available."}
                </div>
            ) : (
                <>
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
                </>
            )}

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