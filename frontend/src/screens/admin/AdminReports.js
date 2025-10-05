import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listOrders } from '../../actions/orderActions';
import { listProducts } from '../../actions/productActions';

function AdminReports() {
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('7'); // Last 7 days
  const [reportData, setReportData] = useState({});
  
  const dispatch = useDispatch();
  const orderList = useSelector(state => state.orderList);
  const { orders } = orderList;
  const productList = useSelector(state => state.productList);
  const { products } = productList;

  useEffect(() => {
    dispatch(listOrders());
    dispatch(listProducts());
  }, [dispatch]);

  useEffect(() => {
    generateReport();
  }, [reportType, dateRange, orders, products]);

  const generateReport = () => {
    const days = parseInt(dateRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Filter orders by date range
    const filteredOrders = Array.isArray(orders) ? orders.filter(order => 
      new Date(order.createdAt) >= startDate
    ) : [];

    let data = {};

    switch (reportType) {
      case 'overview':
        data = generateOverviewReport(filteredOrders);
        break;
      case 'sales':
        data = generateSalesReport(filteredOrders);
        break;
      case 'products':
        data = generateProductReport(filteredOrders, products);
        break;
      case 'users':
        data = generateUserReport(filteredOrders);
        break;
      default:
        data = generateOverviewReport(filteredOrders);
    }

    setReportData(data);
  };

  const generateOverviewReport = (filteredOrders) => {
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const completedOrders = filteredOrders.filter(order => order.isDelivered).length;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
        topCategories: getTopCategories(filteredOrders, products)
    };
  };

  const generateSalesReport = (filteredOrders) => {
    // Group by day for trend analysis
    const dailySales = {};
    filteredOrders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString();
      if (!dailySales[date]) {
        dailySales[date] = { orders: 0, revenue: 0 };
      }
      dailySales[date].orders++;
      dailySales[date].revenue += order.totalPrice || 0;
    });

    return {
      dailySales,
      totalRevenue: Object.values(dailySales).reduce((sum, day) => sum + day.revenue, 0),
      totalOrders: Object.values(dailySales).reduce((sum, day) => sum + day.orders, 0)
    };
  };

  const generateProductReport = (filteredOrders, products) => {
    // Get product sales from order items
    const productSales = {};
    filteredOrders.forEach(order => {
      if (order.orderItems) {
        order.orderItems.forEach(item => {
          if (!productSales[item.product]) {
            productSales[item.product] = { sales: 0, revenue: 0 };
          }
          productSales[item.product].sales += item.qty;
          productSales[item.product].revenue += item.qty * item.price;
        });
      }
    });

    return {
      productSales,
      totalProducts: products && products.length || 0,
      lowStockProducts: products && products.filter(p => p.countInStock < 10).length || 0
    };
  };

  const generateUserReport = (filteredOrders) => {
    const uniqueUsers = new Set(filteredOrders.map(order => order.user && order.user._id));
    const repeatCustomers = filteredOrders.reduce((acc, order) => {
      const userId = order.user && order.user._id;
      if (!acc[userId]) {
        acc[userId] = { orders: 0, totalSpent: 0 };
      }
      acc[userId].orders++;
      acc[userId].totalSpent += order.totalPrice || 0;
      return acc;
    }, {});

    return {
      uniqueCustomers: uniqueUsers.size,
      repeatCustomers: Object.values(repeatCustomers).filter(customer => customer.orders > 1).length,
      customerData: repeatCustomers
    };
  };

  const getTopCategories = (filteredOrders, products) => {
    const categorySales = {};
    
    filteredOrders.forEach(order => {
      if (order.orderItems) {
        order.orderItems.forEach(item => {
          // Find product to get category
          const product = products && products.find(p => p._id === item.product);
          if (product) {
            categorySales[product.category] = (categorySales[product.category] || 0) + item.price * item.qty;
          }
        });
      }
    });

    return Object.entries(categorySales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, revenue]) => ({ category, revenue }));
  };

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

  const exportReport = () => {
    const csvContent = generateCSVExport();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const generateCSVExport = () => {
    const headers = ['Field', 'Value'];
    const data = Object.entries(reportData).map(([key, value]) => [key, value]);
    return [headers, ...data].map(row => row.join(',')).join('\n');
  };

  return (
    <div className="admin-reports">
      <div className="admin-card-header">
        <h2 className="admin-card-title">Reports & Analytics</h2>
        <p className="admin-card-subtitle">Generate insights and export data</p>
      </div>

      {/* Report Controls */}
      <div className="admin-card">
        <div className="report-controls">
          <div className="admin-form-row">
            <div className="admin-formgroupId">
              <label className="admin-form-label">Report Type</label>
              <select
                className="admin-form-input admin-form-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="overview">Overview Report</option>
                <option value="sales">Sales Report</option>
                <option value="products">Product Report</option>
                <option value="users">User Report</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Date Range</label>
              <select
                className="admin-form-input admin-form-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last Year</option>
              </select>
            </div>

            <div className="admin-form-group">
              <button 
                onClick={exportReport}
                className="admin-btn admin-btn-primary"
                style={{ alignSelf: 'end', marginTop: '1.5rem' }}
              >
                📊 Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {reportType === 'overview' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Overview Report</h3>
            <p className="admin-card-subtitle">Key metrics and performance indicators</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value">{formatCurrency(reportData.totalRevenue || 0)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-title">Total Orders</div>
              <div className="stat-value">{reportData.totalOrders || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-title">Avg Order Value</div>
              <div className="stat-value">{formatCurrency(reportData.averageOrderValue || 0)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-title">Completion Rate</div>
              <div className="stat-value">{Math.round(reportData.completionRate || 0)}%</div>
            </div>
          </div>

          {reportData.topCategories && (
            <div className="top-categories">
              <h4>Top Categories by Revenue</h4>
              <div className="category-list">
                {reportData.topCategories.map(({ category, revenue }) => (
                  <div key={category} className="category-item">
                    <span className="category-name">{category}</span>
                    <span className="category-revenue">{formatCurrency(revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      )}

      {reportType === 'sales' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Sales Report</h3>
            <p className="admin-card-subtitle">Daily sales breakdown and trends</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value">{formatCurrency(reportData.totalRevenue || 0)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-title">Total Orders</div>
              <div className="stat-value">{reportData.totalOrders || 0}</div>
            </div>
          </div>

          <h4>Daily Sales Trend</h4>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                  <th>Avg Order Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(reportData.dailySales || {}).map(([date, data]) => (
                  <tr key={date}>
                    <td>{date}</td>
                    <td>{data.orders}</td>
                    <td>{formatCurrency(data.revenue)}</td>
                    <td>{formatCurrency(data.revenue / data.orders)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'products' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Product Report</h3>
            <p className="admin-card-subtitle">Product performance and inventory status</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-title">Total Products</div>
              <div className="stat-value">{reportData.totalProducts || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-title">Low Stock</div>
              <div className="stat-value">{reportData.lowStockProducts || 0}</div>
            </div>
          </div>

          <h4>Product Performance</h4>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Sales</th>
                  <th>Revenue</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(products) && products.map(product => {
                  const sales = reportData.productSales && reportData.productSales[product._id] || { sales: 0, revenue: 0 };
                  return (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{sales.sales}</td>
                      <td>{formatCurrency(sales.revenue)}</td>
                      <td>
                        <span className={`${product.countInStock < 10 ? 'admin-badge admin-badge-warning' : 'admin-badge admin-badge-success'}`}>
                          {product.countInStock} left
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'users' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">User Report</h3>
            <p className="admin-card-subtitle">Customer behavior and loyalty metrics</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-title">Unique Customers</div>
              <div className="stat-value">{reportData.uniqueCustomers || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔄</div>
              <div className="stat-title">Repeat Customers</div>
              <div className="stat-value">{reportData.repeatCustomers || 0}</div>
            </div>
          </div>

          <h4>Customer Analysis</h4>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {reportData.customerData && Object.keys(reportData.customerData).length > 0 ? (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Customer ID</th>
                      <th>Total Orders</th>
                      <th>Total Spent</th>
                      <th>Avg Order Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(reportData.customerData).map(([userId, data]) => (
                      <tr key={userId}>
                        <td>#{userId.substring(0, 8)}...</td>
                        <td>{data.orders}</td>
                        <td>{formatCurrency(data.totalSpent)}</td>
                        <td>{formatCurrency(data.totalSpent / data.orders)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                No customer data available for the selected period
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReports;
