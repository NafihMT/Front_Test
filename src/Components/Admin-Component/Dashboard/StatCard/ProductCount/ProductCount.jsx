import React, { useEffect, useState } from "react";
import StatCard from '../StatCard';
import { ShoppingBag } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";
const ProductCountCard = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/product/GetAll-Product`)
      .then(res => res.json())
      .then(data => {
        const products = data.data || data || [];
        setCount(products.length);
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  return (
    <StatCard
      title="Total Products"
      value={count}
      icon={<ShoppingBag size={24} color="#2563eb" />}
    />
  );
};

export default ProductCountCard;
