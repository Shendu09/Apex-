import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';

const FarmerProductManagement = ({ language }) => {
  const navigate = useNavigate();
  const t = (key) => getTranslation(language, key);
  
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    unit: 'kg',
    category: 'vegetables',
    stock: '',
    description: '',
    organic: false,
    image: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const farmerProducts = JSON.parse(localStorage.getItem('farmerProducts') || '[]');
    setProducts(farmerProducts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const farmerName = user.name || 'Local Farmer';
    
    const newProduct = {
      ...formData,
      id: editingProduct ? editingProduct.id : Date.now(),
      farmerId: user.id || 1,
      farmerName: farmerName,
      addedDate: editingProduct ? editingProduct.addedDate : new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      available: true,
      rating: editingProduct ? editingProduct.rating : 0,
      reviews: editingProduct ? editingProduct.reviews : 0
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? newProduct : p);
    } else {
      updatedProducts = [...products, newProduct];
    }

    localStorage.setItem('farmerProducts', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    
    // Update global products list for buyers
    updateBuyerProductsList(newProduct);
    
    resetForm();
    setShowAddModal(false);
    setEditingProduct(null);
  };

  const updateBuyerProductsList = (product) => {
    const allProducts = JSON.parse(localStorage.getItem('allAvailableProducts') || '[]');
    const existingIndex = allProducts.findIndex(p => p.id === product.id);
    
    if (existingIndex !== -1) {
      allProducts[existingIndex] = product;
    } else {
      allProducts.push(product);
    }
    
    localStorage.setItem('allAvailableProducts', JSON.stringify(allProducts));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      unit: product.unit,
      category: product.category,
      stock: product.stock,
      description: product.description || '',
      organic: product.organic || false,
      image: product.image || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      localStorage.setItem('farmerProducts', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      
      // Remove from buyer's list
      const allProducts = JSON.parse(localStorage.getItem('allAvailableProducts') || '[]');
      const filtered = allProducts.filter(p => p.id !== productId);
      localStorage.setItem('allAvailableProducts', JSON.stringify(filtered));
    }
  };

  const toggleAvailability = (productId) => {
    const updatedProducts = products.map(p => 
      p.id === productId ? { ...p, available: !p.available } : p
    );
    localStorage.setItem('farmerProducts', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    
    // Update in buyer's list
    const product = updatedProducts.find(p => p.id === productId);
    if (product) {
      updateBuyerProductsList(product);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      unit: 'kg',
      category: 'vegetables',
      stock: '',
      description: '',
      organic: false,
      image: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-farm-green text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('/farmer/dashboard')} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">My Products</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-white text-farm-green px-4 py-2 rounded-lg font-semibold text-sm hover:bg-green-50"
          >
            + Add
          </button>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto pb-20">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-gray-600 text-sm">Total Products</p>
            <p className="text-2xl font-bold text-farm-green">{products.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-gray-600 text-sm">Available</p>
            <p className="text-2xl font-bold text-green-600">{products.filter(p => p.available).length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-gray-600 text-sm">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600">{products.filter(p => !p.available).length}</p>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Products Yet</h3>
            <p className="text-gray-500 mb-6">Start adding your products to make them available to buyers</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-farm-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-farm-dark-green"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-48 bg-gray-200">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {product.category === 'vegetables' ? '🥬' : 
                       product.category === 'fruits' ? '🍎' : 
                       product.category === 'grains' ? '🌾' : '🥛'}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex space-x-2">
                    {product.organic && (
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                        🌿 Organic
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded text-xs font-bold ${product.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.available ? 'Available' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 capitalize">{product.category}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-2xl font-bold text-farm-green">₹{product.price}</span>
                      <span className="text-gray-600 text-sm">/{product.unit}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Stock: <span className="font-semibold">{product.stock} {product.unit}</span>
                    </div>
                  </div>

                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleAvailability(product.id)}
                      className={`flex-1 py-2 rounded-lg font-semibold text-sm ${
                        product.available 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      {product.available ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-farm-green outline-none"
                  placeholder="e.g., Fresh Tomatoes"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-farm-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Unit *</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-farm-green outline-none"
                  >
                    <option value="kg">per kg</option>
                    <option value="gram">per gram</option>
                    <option value="piece">per piece</option>
                    <option value="dozen">per dozen</option>
                    <option value="liter">per liter</option>
                    <option value="bunch">per bunch</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-farm-green outline-none"
                  >
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                    <option value="dairy">Dairy</option>
                    <option value="pulses">Pulses</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-farm-green outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-farm-green outline-none"
                  placeholder="Brief description about the product quality, freshness, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-farm-green outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="organic"
                  checked={formData.organic}
                  onChange={(e) => setFormData({...formData, organic: e.target.checked})}
                  className="w-5 h-5 text-farm-green"
                />
                <label htmlFor="organic" className="text-sm font-semibold">Mark as Organic Product</label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-farm-green text-white rounded-lg font-semibold hover:bg-farm-dark-green"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerProductManagement;
