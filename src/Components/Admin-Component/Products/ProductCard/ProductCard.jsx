import React from 'react';
import './ProductCard.css';

function ProductCard({ product, onEdit, onDelete }) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
  }).format(product.price);

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-card__image" />
      
      <div className="product-card__details">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__category">{product.category}</p>
      </div>
      
      <div className="product-card__price">
        {formattedPrice}
      </div>

      <div className="product-card__actions">
        <button onClick={onEdit} className="action-btn edit-btn">Edit</button>
        <button onClick={onDelete} className="action-btn delete-btn">Delete</button>
      </div>
    </div>
  );
}

export default ProductCard;