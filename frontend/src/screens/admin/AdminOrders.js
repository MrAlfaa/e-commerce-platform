import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listOrders } from '../../actions/orderActions';
import axios from 'axios';
import Cookie from 'js-cookie';

function AdminOrders() {
  const [loading, setLoading] = useState(false);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });

  const dispatch = useDispatch();
  const orderList = useSelector(state => state.orderList);
  const { orders, loading: ordersLoading } = orderList;

  useEffect(() => {
    dispatch(listOrders());
    calculateOrderStats();
  }, [dispatch]);

  useEffect(() => {
    calculateOrderStats();
  }, [orders]);

  const calculateOrderStats = () => {
    if (orders && orders.length > 0) {
      const totalOrders = orders.length;
      const completedOrders = orders.filter(order => order.isDelivered).length;
      const pendingOrders = orders.filter(order => !order.isDelivered).length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

      setOrderStats({
        totalOrders,
        completedOrders,
        pendingOrders,
        totalRevenue
      });
    }
  };

  const updateOrderStatus = async (orderId, field, value) => {
    try {
      setLoading(true);
      
      const updateData = { [field]: value };
      if (field === 'isPaid' && value) {
        updateData.paidAt = new Date();
      }
      if (field === 'isDelivered' && value) {
        updateData.deliveredAt = new Date();
      }

      await axios.put(`/api/orders/${orderId}/pay`, updateData, {
        headers: { Authorization: `Bearer ${Cookie.getJSON('userInfo')?.token}` }
      });

      dispatch(listOrders());
      setLoading(false);
    } catch (error) {
      console.error('Failed to update order:', error);
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${Cookie.getJSON('userInfo')?.token}` }
        });

        dispatch(listOrders());
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderStatusBadge = (order) => {
    if (order.isDelivered) {
      return <span className="admin-badge admin-badge-success">Delivered</span>;
    } else if (order.isPaid) {
      return <span className="admin-badge admin-badge-warning">Shipped</span>;
    } else {
      return <span className="admin-badge admin-badge-secondary">Pending</span>;
    }
  };

  return (
    <div className="admin-orders">
      <div className="admin-card-header">
        <h2 className="admin-card-title">Order Management</h2>
        <p className="admin-card-subtitle">Monitor and manage customer orders</p>
      </div>

      {/* Order Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-title">Total Orders</div>
          <div className="stat-value">{orderStats.totalOrders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-title">Completed</div>
          <div className="stat-value">{orderStats.completedOrders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-title">Pending</div>
          <div className="stat-value">{orderStats.pendingOrders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value">${orderStats.totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">All Orders ({Array.isArray(orders) ? orders.length : 0})</h3>
        </div>

        {ordersLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading orders...</div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(orders) && orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                        #{order._id.substring(0, 8)}...
                      </div>
                    </td>
                    <td>
                      <div>{order.user?.name || 'N/A'}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {order.user?.email || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div>{order.orderItems?.length || 0} items</div>
                      {order.orderItems && order.orderItems.length > 0 && (
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {order.orderItems[0]?.name}
                          {order.orderItems.length > 1 && ` +${order.orderItems.length - 1} more`}
                        </div>
                      )}
                    </td>
                    <td>{getOrderStatusBadge(order)}</td>
                    <td>${order.totalPrice?.toFixed(2) || '0.00'}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        {!order.isPaid && (
                          <button 
                            onClick={() => updateOrderStatus(order._id, 'isPaid', true)}
                            className="admin-btn admin-btn-success admin-btn-small"
                            disabled={loading}
                          >
                            ✓ Mark Paid
                          </button>
                        )}
                        {order.isPaid && !order.isDelivered && (
                          <button 
                            onClick={() => updateOrderStatus(order._id, 'isDelivered', true)}
                            className="admin-btn admin-btn-success admin-btn-small"
                            disabled={loading}
                          >
                            📦 Mark Delivered
                          </button>
                        )}
                        {order.isPaid && order.isDelivered && (
                          <span style={{ fontSize: '0.8rem', color: '#10b981' }}>
                            ✓ Complete
                          </span>
                        )}
                        <button 
                          onClick={() => deleteOrder(order._id)}
                          className="admin-btn admin-btn-danger admin-btn-small"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <div className="orders-summary">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Order Summary</h3>
          </div>
          <div className="summary-stats">
            <div className="summary-item">
              <span className="summary-label">Average Order Value:</span>
              <span className="summary-value">
                ${Array.isArray(orders) && orders.length > 0 ? (orderStats.totalRevenue / orders.length).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Completion Rate:</span>
              <span className="summary-value">
                {Array.isArray(orders) && orders.length > 0 ? Math.round((orderStats.completedOrders / orders.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
