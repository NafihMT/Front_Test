import React, { useEffect, useState } from "react";
import StatCard from '../StatCard';
import { Users } from "lucide-react"; 

const UserCountCard = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5298/api/User")
      .then((res) => res.json())
      .then((data) => setCount(data.data.length)) 
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
