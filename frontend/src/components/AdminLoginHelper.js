import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signin } from '../actions/userActions';
import { getToken } from '../util';

function AdminLoginHelper({ onClose }) {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await dispatch(signin(email, password));
      // Check if login was successful
      const token = getToken();
      if (token) {
        onClose && onClose();
        // Refresh the page to update the admin state
        window.location.reload();
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>Admin Login Required</h2>
        <p style={{ marginBottom: '1.5rem', color: '#666' }}>
          To access the admin panel and view all users, you need to log in as an admin user.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          
          {error && (
            <div style={{
              color: '#d32f2f',
              marginBottom: '1rem',
              padding: '0.5rem',
              backgroundColor: '#ffebee',
              borderRadius: '4px',
              border: '1px solid #ffcdd2'
            }}>
              {error}
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#f5f5f5',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
        
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '0.9rem',
          color: '#666'
        }}>
          <strong>Default Admin Credentials:</strong><br />
          Email: admin@gmail.com<br />
          Password: admin
        </div>
      </div>
    </div>
  );
}

export default AdminLoginHelper;

