import React, { useEffect, useState } from "react";
import axios from 'axios'
import StatCard from '../StatCard';
import { IndianRupee } from "lucide-react";

const RevenueCard = () => {
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:5298/api/Order")
      .then((res) => {
        const orders = res.data.data || [];

        const total = orders
          .filter((order) => order.status === "Delivered")
          .reduce((sum, order) => sum + order.totalAmount, 0);

        setRevenue(total);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  return (
    <StatCard
      title="Total Revenue"
      value={`₹${revenue.toLocaleString()}`}
      icon={<IndianRupee size={24} color="#2563eb" />}
    />
  );
};

export default RevenueCard;
