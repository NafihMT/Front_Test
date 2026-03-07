import React from 'react'
import './Dashboard.css'
import UserCountCard from './StatCard/UserCount/UserCount'
import ProductCountCard from './StatCard/ProductCount/ProductCount'
import RevenueCountCard from './StatCard/RevenueCount/RevenueCount'
import RevenueChart from './StatCard/RevenueChart/RevenueChart'

function Dashboard() {
    return (
        <div className="dashboard-container">

            <h1 className="dashboard-title">
                Dashboard Overview
            </h1>

            <div className="dashboard-grid">

                <UserCountCard />
                <ProductCountCard />

                <RevenueCountCard />
                <RevenueChart />

            </div>

        </div>
    )
}

export default Dashboard