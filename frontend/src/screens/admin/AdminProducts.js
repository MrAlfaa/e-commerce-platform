import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listProducts, saveProduct, deleteProdcut } from '../../actions/productActions';
import axios from 'axios';

function AdminProducts() {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    brand: '',
    category: 'Electronics',
    countInStock: '',
    description: ''
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const productList = useSelector(state => state.productList);
  const { products, loading } = productList;

  const productSave = useSelector(state => state.productSave);
  const { success: successSave, error: saveError } = productSave;

  const productDelete = useSelector(state => state.productDelete);
  
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch, successSave]);

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      image: '',
      brand: '',
      category: 'Electronics',
      countInStock: '',
      description: ''
    });
    setEditingProduct(null);
    setShowForm(false);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Check if user is authenticated and is admin
    if (!userInfo || !userInfo.token) {
      setError('You must be logged in to perform this action');
      return;
    }
    if (!userInfo.isAdmin) {
      setError('Admin privileges required to manage products');
      return;
    }

    // Validate form data
    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price is required');
      return;
    }
    if (!formData.image.trim()) {
      setError('Product image is required');
      return;
    }
    if (!formData.brand.trim()) {
      setError('Brand is required');
      return;
    }
    if (!formData.countInStock || parseInt(formData.countInStock) < 0) {
      setError('Valid stock quantity is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      countInStock: parseInt(formData.countInStock),
      rating: 0,
      numReviews: 0
    };

    if (editingProduct) {
      productData._id = editingProduct._id;
    }

    dispatch(saveProduct(productData));
    resetForm();
  };

  const openEditForm = (product) => {
    setFormData({
      name: product.name || '',
      price: product.price || '',
      image: product.image || '',
      brand: product.brand || '',
      category: product.category || 'Electronics',
      countInStock: product.countInStock || '',
      description: product.description || ''
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (product) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProdcut(product._id));
    }
  };

  const uploadFileHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    setUploading(true);

    axios
      .post('/api/uploads', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.data.imagePath) {
          setFormData({ ...formData, image: response.data.imagePath });
        } else {
          // Fallback for old response format
          setFormData({ ...formData, image: response.data });
        }
        setUploading(false);
      })
      .catch((err) => {
        console.error('Upload error:', err);
        alert('Upload failed: ' + (err.response?.data?.message || err.message));
        setUploading(false);
      });
  };

  const categories = [
    'Electronics', 
    'Clothing', 
    'Books', 
    'Home & Garden', 
    'Sports', 
    'Toys', 
    'Beauty', 
    'Automotive',
    'Shirts',
    'Pants',
    'Shoes',
    'Accessories'
  ];

  return (
    <div className="admin-products">
      <div className="admin-card-header">
        <h2 className="admin-card-title">Product Management</h2>
        <p className="admin-card-subtitle">Manage your store's product catalog</p>
      </div>

      {/* Add/Edit Product Form */}
      {showForm && (
        <div className="admin-form">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
          </div>

          <form onSubmit={handleSubmit}>
            {(error || saveError) && (
              <div className="error-message" style={{ 
                background: '#fee', 
                color: '#c00', 
                padding: '1rem', 
                borderRadius: '4px', 
                marginBottom: '1rem' 
              }}>
                {error || saveError}
              </div>
            )}
            <div className="admin-form-group">
              <label className="admin-form-label">Product Name</label>
              <input
                type="text"
                className="admin-form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="admin-form-input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Stock Quantity</label>
                <input
                  type="number"
                  className="admin-form-input"
                  value={formData.countInStock}
                  onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Brand</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Category</label>
                <select
                  className="admin-form-input admin-form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Product Image</label>
              <input
                type="text"
                className="admin-form-input"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Enter image URL or upload file"
              />
              <div style={{ marginTop: '0.5rem' }}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={uploadFileHandler} 
                  style={{ marginBottom: '0.5rem' }}
                />
                {uploading && <div style={{ color: '#667eea' }}>Uploading...</div>}
                {formData.image && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img 
                      src={formData.image} 
                      alt="Product preview" 
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        objectFit: 'cover', 
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }} 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Description</label>
              <textarea
                className="admin-form-input admin-form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="admin-btn admin-btn-success">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" onClick={resetForm} className="admin-btn admin-btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">All Products ({products.length})</h3>
          <button 
            onClick={() => setShowForm(true)} 
            className="admin-btn admin-btn-primary"
          >
            ➕ Add New Product
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading products...</div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{product.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {product.description && product.description.substring(0, 50) + '...' || 'No description'}
                      </div>
                    </td>
                    <td>{product.brand}</td>
                    <td>{product.category}</td>
                    <td>${product.price}</td>
                    <td>{product.countInStock}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => openEditForm(product)}
                          className="admin-btn admin-btn-secondary admin-btn-small"
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(product)}
                          className="admin-btn admin-btn-danger admin-btn-small"
                        >
                          🗑️ Delete
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
    </div>
  );
}

export default AdminProducts;
