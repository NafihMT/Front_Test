import React, { useEffect, useState } from "react";
import StatCard from '../StatCard';
import { Users } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";


const UserCountCard = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => setCount(data.data.length))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <StatCard
      title="Total Users"
      value={count}
      icon={<Users size={24} color="#2563eb" />}
    />
  );
};

export default UserCountCard;
