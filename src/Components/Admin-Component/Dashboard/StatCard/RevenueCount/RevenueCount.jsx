import React, { useEffect, useState } from "react";
import StatCard from '../StatCard';
import { IndianRupee } from "lucide-react";


const API_BASE_URL = "http://localhost:5000/api";

const RevenueCard = () => {
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/order/revenue`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setRevenue(data.data || 0))
      .catch(err => console.error("Error fetching revenue:", err));
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
