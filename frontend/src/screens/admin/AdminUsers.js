import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { getToken } from '../../util';
import AdminLoginHelper from '../../components/AdminLoginHelper';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isAdmin: false
  });

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  useEffect(() => {
    let isMounted = true;
    
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const token = userInfo?.token || getToken();
        if (!token) {
          setError('Authentication required. Please log in.');
          return;
        }
        
        // Check if user is admin
        if (!userInfo?.isAdmin) {
          setError('Admin privileges required. Please log in as an admin user.');
          setShowAdminLogin(true);
          return;
        }
        
        const response = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Validate response data is an array
        if (isMounted) {
          if (Array.isArray(response.data)) {
            setUsers(response.data);
          } else {
            console.error('API response is not an array:', response.data);
            setUsers([]);
            setError('Invalid data format received from server');
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching users:', error);
          setUsers([]);
          if (error.response?.status === 401) {
            setError('Unauthorized: Please log in as an admin user.');
            setShowAdminLogin(true);
          } else {
            setError('Failed to fetch users: ' + (error.response?.data?.message || error.message));
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [userInfo]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = userInfo?.token || getToken();
      if (!token) {
        setError('Authentication required. Please log in.');
        return;
      }
      
      // Check if user is admin
      if (!userInfo?.isAdmin) {
        setError('Admin privileges required. Please log in as an admin user.');
        setShowAdminLogin(true);
        return;
      }
      
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Validate response data is an array
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error('API response is not an array:', response.data);
        setUsers([]);
        setError('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      if (error.response?.status === 401) {
        setError('Unauthorized: Please log in as an admin user.');
      } else {
        setError('Failed to fetch users: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      isAdmin: false
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form data
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.password.trim() && !editingUser) {
      setError('Password is required for new users');
      return;
    }
    
    const token = userInfo?.token || getToken();
    if (!token) {
      setError('Authentication required. Please log in.');
      return;
    }
    
    // Check if user is admin
    if (!userInfo?.isAdmin) {
      setError('Admin privileges required. Please log in as an admin user.');
      return;
    }
    
    try {
      const userData = editingUser 
        ? { ...formData, _id: editingUser._id }
        : formData;

      if (editingUser) {
        // Update existing user
        await axios.put(`/api/admin/users/${editingUser._id}`, userData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create new user
        const response = await axios.post('/api/admin/users', userData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('User created:', response.data);
      }

      fetchUsers();
      resetForm();
    } catch (error) {
      setError('Failed to save user: ' + (error.response?.data?.message || error.message));
    }
  };

  const openEditForm = (user) => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      isAdmin: user.isAdmin || false
    });
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = async (user) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const token = userInfo?.token || getToken();
      if (!token) {
        setError('Authentication required. Please log in.');
        return;
      }
      
      // Check if user is admin
      if (!userInfo?.isAdmin) {
        setError('Admin privileges required. Please log in as an admin user.');
        setShowAdminLogin(true);
        return;
      }
      
      try {
        await axios.delete(`/api/admin/users/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
      } catch (error) {
        setError('Failed to delete user: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const toggleAdminStatus = async (user) => {
    const token = userInfo?.token || getToken();
    if (!token) {
      setError('Authentication required. Please log in.');
      return;
    }
    
    // Check if user is admin
    if (!userInfo?.isAdmin) {
      setError('Admin privileges required. Please log in as an admin user.');
      return;
    }
    
    try {
      await axios.put(`/api/admin/users/${user._id}/toggle-admin`, {
        isAdmin: !user.isAdmin
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      setError('Failed to update user status: ' + (error.response?.data?.message || error.message));
    }
  };

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || 
                        (filterRole === 'admin' && user.isAdmin) ||
                        (filterRole === 'user' && !user.isAdmin);
    return matchesSearch && matchesRole;
  });

  return (
    <div className="admin-users">
      {showAdminLogin && (
        <AdminLoginHelper onClose={() => setShowAdminLogin(false)} />
      )}
      
      <div className="admin-card-header">
        <h2 className="admin-card-title">User Management</h2>
        <p className="admin-card-subtitle">Manage user accounts and permissions</p>
      </div>

      {error && (
        <div className="error-message" style={{ 
          background: '#fee', 
          color: '#c00', 
          padding: '1rem', 
          borderRadius: '4px', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
      )}

      {/* Add/Edit User Form */}
      {showForm && (
        <div className="admin-form">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label className="admin-form-label">Full Name</label>
              <input
                type="text"
                className="admin-form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Email Address</label>
              <input
                type="email"
                className="admin-form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">
                Password {editingUser && '(leave blank to keep current password)'}
              </label>
              <input
                type="password"
                className="admin-form-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label admin-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isAdmin}
                  onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                />
                <span className="checkmark"></span>
                Admin Privileges
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="admin-btn admin-btn-success">
                {editingUser ? 'Update User' : 'Create User'}
              </button>
              <button type="button" onClick={resetForm} className="admin-btn admin-btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Search & Filter Users</h3>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-form-input"
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="admin-form-input admin-form-select"
            >
              <option value="all">All Users</option>
              <option value="admin">Admins Only</option>
              <option value="user">Regular Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">All Users ({filteredUsers.length} of {users.length})</h3>
          <button 
            onClick={() => setShowForm(true)} 
            className="admin-btn admin-btn-primary"
          >
            ➕ Add New User
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading users...</div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Admin Status</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{user.name}</div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`admin-badge ${user.isAdmin ? 'admin-badge-success' : 'admin-badge-secondary'}`}>
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => openEditForm(user)}
                            className="admin-btn admin-btn-secondary admin-btn-small"
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => toggleAdminStatus(user)}
                            className={`admin-btn admin-btn-small ${user.isAdmin ? 'admin-btn-secondary' : 'admin-btn-success'}`}
                            style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                          >
                            {user.isAdmin ? '👑 Remove Admin' : '👤 Make Admin'}
                          </button>
                          <button 
                            onClick={() => handleDelete(user)}
                            className="admin-btn admin-btn-danger admin-btn-small"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      {searchTerm || filterRole !== 'all' ? 'No users found matching your criteria' : 'No users found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
