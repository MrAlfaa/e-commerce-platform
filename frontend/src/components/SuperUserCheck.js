import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkSuperUserExists } from '../actions/superUserActions';
import { Link, useHistory } from 'react-router-dom';

function SuperUserCheck({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const dispatch = useDispatch();
  const history = useHistory();
  const superUserCheck = useSelector(state => state.superUserCheck);
  const { loading, exists, error } = superUserCheck;

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if superuser exists
        await dispatch(checkSuperUserExists());
      } catch (err) {
        console.error('Error checking superuser existence:', err);
      } finally {
        setIsChecking(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  // Redirect to signin if superuser exists and we're not already on signin or superuser-setup
  useEffect(() => {
    if (exists && !isChecking && !loading) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/signin' && currentPath !== '/superuser-setup') {
        history.push('/signin');
      }
    }
  }, [exists, isChecking, loading, history]);

  // Show loading while checking or if we haven't received a response yet
  if (isChecking || loading || (exists === undefined && !error)) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Initializing application...</p>
        </div>
        <style>{`
          .app-loading {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }
          
          .loading-spinner {
            text-align: center;
            color: white;
          }
          
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .loading-spinner p {
            margin: 0;
            font-size: 16px;
          }
        `}</style>
      </div>
    );
  }

  // Show error if check failed
  if (error) {
    return (
      <div className="app-error">
        <div className="error-container">
          <h2>Application Error</h2>
          <p>Failed to initialize the application: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-btn"
          >
            Retry
          </button>
          <style>{`
            .app-error {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: #f5f5f5;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .error-container {
              text-align: center;
              padding: 2rem;
              background: white;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              max-width: 400px;
            }
            
            .retry-btn {
              margin-top: 1rem;
              padding: 10px 20px;
              background: #667eea;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
            }
            
            .retry-btn:hover {
              background: #5a6fd8;
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Show superuser setup message if no superuser exists and we're not loading
  if (exists === false && !loading && !isChecking) {
    return (
      <div className="superuser-setup-prompt">
        <div className="setup-prompt-container">
          <div className="setup-prompt-content">
            <h1><span role="img" aria-label="Rocket">🚀</span> Welcome to Amazona Admin Panel</h1>
            <p>
              This is the first time running the application. 
              You need to create a superuser account to access the admin panel.
            </p>
            <div className="setup-features">
              <h3>SuperUser Benefits:</h3>
              <ul>
              <li><span role="img" aria-label="Control Panel">🎛️</span> Full administrative control</li>
              <li><span role="img" aria-label="Analytics">📊</span> Access to all analytics and reports</li>
              <li><span role="img" aria-label="User Management">👥</span> Manage users and permissions</li>
              <li><span role="img" aria-label="Product Control">📦</span> Control product inventory</li>
              <li><span role="img" aria-label="Order Monitoring">📋</span> Monitor all orders</li>
              </ul>
            </div>
            <div className="setup-actions">
              <Link to="/superuser-setup" className="btn-primary">
                Create SuperUser Account
              </Link>
            </div>
          </div>
        </div>
        <style>{`
          .superuser-setup-prompt {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }
          
          .setup-prompt-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);


            max-width: 500px;
            width: 90%;
            overflow: hidden;
          }
          
          .setup-prompt-content {
            padding: 2rem;
            text-align: center;
          }
          
          .setup-prompt-content h1 {
            color: #333;
            margin-bottom: 1rem;
            font-size: 1.8rem;
          }
          
          .setup-prompt-content p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 2rem;
          }
          
          .setup-features {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            text-align: left;
          }
          
          .setup-features h3 {
            margin: 0 0 1rem 0;
            color: #333;
            text-align: center;
          }
          
          .setup-features ul {
            margin: 0;
            padding-left: 1.5rem;
          }
          
          .setup-features li {
            margin-bottom: 0.5rem;
            color: #555;
          }
          
          .btn-primary {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: transform 0.2s;
          }
          
          .btn-primary:hover {
            transform: translateY(-2px);
          }
        `}</style>
      </div>
    );
  }

  // If superuser exists, render the app normally
  if (exists === true && !loading && !isChecking) {
    return children;
  }

  // Fallback - should not reach here, but just in case
  return (
    <div className="app-loading">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}

export default SuperUserCheck;
