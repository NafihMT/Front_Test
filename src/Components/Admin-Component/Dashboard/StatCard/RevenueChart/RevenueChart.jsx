import React, { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, 
    ResponsiveContainer, CartesianGrid
} from "recharts";
import api from "../../../../../api/api";
import "./RevenueChart.css";

function RevenueChart() {
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const response = await api.get("/orders/revenue-stats");
                const data = response.data.data || response.data;
                setRevenueData(data);
            } catch (error) {
                console.error("Failed to fetch revenue data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRevenue();
    }, []);

    if (loading) return <div>Loading Chart...</div>;

    return (
        <div className="revenue-chart-container">
            <h3 className="revenue-chart-title">Revenue Overview</h3>
            <div className="revenue-chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#888', fontSize: 12}} 
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#888', fontSize: 12}}
                            tickFormatter={(value) => `₹${value}`} 
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            formatter={(value) => [`₹${value}`, "Revenue"]}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#ff8c00" 
                            strokeWidth={4} 
                            dot={{ r: 6, fill: "#ff8c00", strokeWidth: 2, stroke: "#fff" }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default RevenueChart;