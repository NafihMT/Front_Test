import React from "react";
import './StatCard.css'

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="stat-card">
      <div>
        <p className="card-title">{title}</p>
        <p className="card-value">{value}</p>
        
      </div>
      <div className="card-icon-wrapper">{icon}</div>
    </div>
  );
};

export default StatCard;
