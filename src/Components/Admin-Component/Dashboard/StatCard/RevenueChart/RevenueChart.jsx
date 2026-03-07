import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import "./RevenueChart.css";

const data = [
    { month: "Jan", revenue: 5000 },
    { month: "Feb", revenue: 9000 },
    { month: "Mar", revenue: 12000 },
    { month: "Apr", revenue: 18000 },
    { month: "May", revenue: 25000 },
    { month: "Jun", revenue: 33000 },
];

function RevenueChart() {
    return (
        <div className="revenue-chart-container">
            <h3 className="revenue-chart-title">Revenue Overview</h3>
            <div className="revenue-chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default RevenueChart;