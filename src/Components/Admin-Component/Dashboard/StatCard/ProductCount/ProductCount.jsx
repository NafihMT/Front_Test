import React, { useEffect, useState } from "react";
import StatCard from '../StatCard';
import { ShoppingBag } from "lucide-react"; 


const ProductCountCard = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5298/api/Product")
      .then((res) => res.json())
      .then((data) => setCount(data.data.length)) 
      .catch((err) => console.error("Error fetching users:", err));
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
