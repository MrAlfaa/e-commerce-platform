import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listProducts } from '../../actions/productActions';
import { listOrders } from '../../actions/orderActions';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0
  });

  const dispatch = useDispatch();

  // Mock stats - in real app these would come from API
  useEffect(() => {
    let isMounted = true;
    
    // Simulate loading stats
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setStats({
          totalProducts: 24,
          totalOrders: 156,
          totalRevenue: 12450.50,
          totalUsers: 87
        });
      }
    }, 1000);

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    dispatch(listProducts());
    dispatch(listOrders());
  }, [dispatch]);

  const statsData = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: '📦',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: '📋',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: '💰',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      change: '+5%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-card-header">
        <h2 className="admin-card-title">Dashboard Overview</h2>
        <p className="admin-card-subtitle">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-title">{stat.title}</div>
            <div className="stat-value">{stat.value}</div>
            <div className={`stat-change ${stat.changeType}`}>
              {stat.change} from last month
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Recent Activity</h3>
          <p className="admin-card-subtitle">Latest orders and product updates</p>
        </div>
        
        <div className="recent-activities">
          <div className="activity-item">
            <div className="activity-icon">🛒</div>
            <div className="activity-content">
              <div className="activity-title">New order #ORD-2024-001</div>
              <div className="activity-subtitle">Customer placed an order for $89.99</div>
              <div className="activity-time">2 minutes ago</div>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">📦</div>
            <div className="activity-content">
              <div className="activity-title">Product "Premium Shirt" added</div>
              <div className="activity-subtitle">New product added to Shirts category</div>
              <div className="activity-time">1 hour ago</div>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">👤</div>
            <div className="activity-content">
              <div className="activity-title">New user registration</div>
              <div className="activity-subtitle">John Doe joined your store</div>
              <div className="activity-time">3 hours ago</div>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">📊</div>
            <div className="activity-content">
              <div className="activity-title">Monthly report generated</div>
              <div className="activity-subtitle">Revenue report for November 2024</div>
              <div className="activity-time">1 day ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Quick Actions</h3>
          <p className="admin-card-subtitle">Common admin tasks</p>
        </div>
        
        <div className="quick-actions-grid">
          <button className="admin-btn admin-btn-primary">
            ➕ Add New Product
          </button>
          <button className="admin-btn admin-btn-secondary">
            📋 View All Orders
          </button>
          <button className="admin-btn admin-btn-secondary">
            👥 Manage Users
          </button>
          <button className="admin-btn admin-btn-secondary">
            📊 Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
