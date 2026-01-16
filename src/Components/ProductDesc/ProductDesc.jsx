import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./ProductDesc.css";
import { Heart, ShoppingCart } from 'lucide-react';
import NavBar from '../NavBar/Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ProductDesc() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const navigate = useNavigate();


    useEffect(() => {
        axios.get(`https://localhost:7129/api/Product/${id}`)
            .then(res => setProduct(res.data.data))
            .catch(() => setProduct(null));
    }, [id]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const handleDecrement = () => {
        setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    };

    const handleIncrement = () => {
        setQuantity(prev => prev + 1);
    };

    const addToCart = async (product) => {
        try {
            if (!user) {
                toast.error("Please login to add items to cart!");
                return;
            }

            const response = await axios.post("http://localhost:5298/api/Cart/add", {
                productId: product.id,
                quantity: quantity
            });

            setCart(prev => {
                const existing = prev.find(item => item.productId === product.id);
                if (existing) {
                    return prev.map(item => item.productId === product.id ? response.data.data : item);
                }
                return [...prev, response.data.data];
            });

            toast.success(`${product.name} added to cart!`);
        } catch (error) {
            toast.error("Error adding to cart");
        }
    };

    return (
        <div className="product-main-container">
            <NavBar />
            <div className="main-product-card">
                <div className="product-card-left">
                    <img src={product.image} alt={product.name} className="product-image" />
                </div>

                <div className="product-card-right">
                    <button className="wishlist-button">
                        <Heart size={24} />
                    </button>

                    <div className="product-details-section">
                        <h1>{product.name}</h1>
                        <p className="product-category">{product.category} Helmet</p>
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">
                            ₹{product.price}
                            <span className="taxes">(INCL. OF ALL TAXES)</span>
                        </p>

                        <div className="actions-container">
                            <div className="quantity-selector">
                                <button onClick={handleDecrement}>-</button>
                                <input type="text" value={quantity} readOnly />
                                <button onClick={handleIncrement}>+</button>
                            </div>
                            <button className="add-to-cart-button" onClick={() => addToCart(product)}>
                                <ShoppingCart size={20} /> ADD TO CART
                            </button>
                            <button className="buy-button" onClick={() => {
                                addToCart(product)
                                navigate('/cart')
                            }}>BUY NOW
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDesc;