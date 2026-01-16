import React from 'react'
import SideBar from '../SideBar/SideBar'
import './Dashboard.css'
import UserCountCard from '../Dashboard/StatCard/UserCount/UserCount'
import ProductCountCard from '../Dashboard/StatCard/ProductCount/ProductCount'
import RevenueCountCard from '../Dashboard/StatCard/RevenueCount/RevenueCount'

function Dashboard() {

    return (
        <div>
            <div className="dashboard-main-container">
                {/* <div className="dashboard-sidebar">
                    <SideBar />
                </div> */}
                <div className="dashboard-right-container">
                    <h2 className='heading'>
                        Dashboard Overview
                    </h2>
                    <div className="stat-grid">
                        <UserCountCard />
                        <ProductCountCard />
                        <RevenueCountCard />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
