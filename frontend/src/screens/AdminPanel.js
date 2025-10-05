import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminUsers from './admin/AdminUsers';
import AdminReports from './admin/AdminReports';
import AdminOrders from './admin/AdminOrders';
import './admin/AdminStyle.css';

function AdminPanel(props) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'orders', label: 'Orders', icon: '📋' },
    { id: 'reports', label: 'Reports', icon: '📈' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <AdminProducts />;
      case 'users':
        return <AdminUsers />;
      case 'orders':
        return <AdminOrders />;
      case 'reports':
        return <AdminReports />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="admin-panel">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Admin Panel</h1>
          <div className="admin-header-actions">
            <Link to="/" className="back-to-site-btn">← Back to Site</Link>
            <div className="admin-user-info">
              <span>Admin</span>
              <div className="user-avatar">👤</div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-container">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <ul>
              {sidebarItems.map(item => (
                <li key={item.id}>
                  <button
                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className={item.label}>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="admin-main-content">
          <div className="content-wrapper">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
