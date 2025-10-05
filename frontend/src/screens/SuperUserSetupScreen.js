import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSuperUser, checkSuperUserExists } from '../actions/superUserActions';
import Cookie from 'js-cookie';

function SuperUserSetupScreen(props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const superUserCreate = useSelector(state => state.superUserCreate);
  const { loading, userInfo, error } = superUserCreate;

  const superUserCheck = useSelector(state => state.superUserCheck);
  const { exists, loading: checkLoading } = superUserCheck;

  useEffect(() => {
    // Don't check superuser existence here - SuperUserCheck component handles this
    // This component should only handle the creation form
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      // Store superuser info and redirect to admin panel
      Cookie.set('userInfo', JSON.stringify(userInfo.user));
      props.history.push('/admin');
    }
  }, [userInfo, props.history]);

  // Redirect if superuser already exists (but allow manual navigation to this screen)
  useEffect(() => {
    if (exists && !window.location.search.includes('force=true')) {
      // Don't redirect immediately, show a warning instead
      console.log('Superuser already exists, but allowing creation for testing');
    }
  }, [exists, props.history]);

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Name is required';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      // Show validation errors
      alert('Please correct the following errors:\n' + Object.values(errors).join('\n'));
      return;
    }

    dispatch(createSuperUser({ name, email, password }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Show loading while checking if superuser exists
  if (checkLoading || exists === undefined) {
    return (
      <div className="superuser-setup">
        <div className="setup-container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Checking superuser status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (exists === true) {
    return (
      <div className="superuser-setup">
        <div className="setup-container">
          <div className="setup-header">
            <h1 className="setup-title">⚠️ SuperUser Already Exists</h1>
            <p className="setup-subtitle">
              A superuser account already exists in the system. 
              You can still create another one for testing purposes.
            </p>
          </div>
          <div className="warning-message">
            <p><strong>Warning:</strong> Creating another superuser may cause conflicts. 
            Consider signing in with existing credentials instead.</p>
            <button 
              type="button" 
              onClick={() => props.history.push('/signin')}
              className="btn-secondary"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="superuser-setup">
      <div className="setup-container">
        <div className="setup-header">
          <h1 className="setup-title">🚀 SuperUser Setup</h1>
          <p className="setup-subtitle">
            Create your super administrator account to access the admin panel.
            This account will have full control over the application.
          </p>
        </div>

        <form onSubmit={submitHandler} className="setup-form">
          <div className="form-header">
            <h2>Account Creation</h2>
            <p>Set up your superuser credentials below</p>
          </div>

          {loading && (
            <div className="loading">
              Creating SuperUser account...
            </div>
          )}

          {error && (
            <div className="error-message">
              Error: {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter a secure password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary setup-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "🚀 Create SuperUser Account"}
            </button>
          </div>

          <div className="security-notice">
            <p><strong>Security Notice:</strong></p>
            <ul>
              <li>This account will have full administrative privileges</li>
              <li>Make sure to use a strong, unique password</li>
              <li>Keep these credentials safe and secure</li>
              <li>You'll use these credentials to access the admin panel</li>
            </ul>
          </div>
        </form>
      </div>

        <style>{`
        .superuser-setup {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
        }

        .setup-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 100%;
          overflow: hidden;
        }

        .setup-header {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          color: white;
          padding: 2rem;
          text-align: center;
        }

        .setup-title {
          font-size: 2rem;
          margin: 0 0 1rem 0;
          font-weight: bold;
        }

        .setup-subtitle {
          margin: 0;
          opacity: 0.9;
          line-height: 1.5;
        }

        .setup-form {
          padding: 2rem;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-header h2 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        .form-header p {
          margin: 0;
          color: #666;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #333;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
        }

        .password-input {
          position: relative;
        }

        .password-input input {
          padding-right: 50px;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          padding: 0;
        }

        .form-actions {
          margin: 2rem 0 1.5rem 0;
        }

        .setup-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .setup-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .setup-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .security-notice {
          background: #f8f9fa;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1.5rem;
        }

        .security-notice p {
          margin: 0 0 0.5rem 0;
          font-weight: 600;
          color: #333;
        }

        .security-notice ul {
          margin: 0;
          padding-left: 1.5rem;
        }

        .security-notice li {
          margin-bottom: 0.25rem;
          color: #666;
          font-size: 14px;
        }

        .loading {
          text-align: center;
          padding: 1rem;
          color: #667eea;
          font-weight: 600;
        }

        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          color: #c33;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}

export default SuperUserSetupScreen;
