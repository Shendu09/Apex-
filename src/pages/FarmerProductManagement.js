import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';
import { analyzeProductImage } from '../config/gemini';

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
    image: '',
    qualityCheck: null // AI quality analysis
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);

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
    setImagePreview(product.image || null);
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
    setImagePreview(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      setFormData({...formData, image: base64String});
      setImagePreview(base64String);
      
      // Analyze image quality using AI
      setAnalyzingImage(true);
      try {
        const qualityAnalysis = await analyzeProductImage(base64String);
        if (qualityAnalysis) {
          setFormData(prev => ({...prev, qualityCheck: qualityAnalysis}));
          console.log('Quality Analysis:', qualityAnalysis);
        }
      } catch (error) {
        console.error('Error analyzing image:', error);
      } finally {
        setAnalyzingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processImageFile(file);
    }
  };

  const removeImage = () => {
    setFormData({...formData, image: '', qualityCheck: null});
    setImagePreview(null);
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
                <label className="block text-sm font-semibold mb-2">Product Image (Optional)</label>
                
                {/* Image Upload Area */}
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                    isDragging 
                      ? 'border-farm-green bg-green-50' 
                      : 'border-gray-300 hover:border-farm-green hover:bg-gray-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {imagePreview || formData.image ? (
                    // Image Preview with Quality Analysis
                    <div className="relative">
                      <img 
                        src={imagePreview || formData.image} 
                        alt="Product preview" 
                        className="max-h-48 mx-auto rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      
                      {/* AI Quality Analysis Display */}
                      {analyzingImage && (
                        <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            <p className="text-sm text-blue-600 font-semibold">AI is analyzing image quality...</p>
                          </div>
                        </div>
                      )}
                      
                      {formData.qualityCheck && !analyzingImage && (
                        <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-bold text-gray-800">🤖 AI Quality Check</h4>
                            <div className="flex items-center space-x-1">
                              <span className="text-2xl font-bold text-green-600">{formData.qualityCheck.qualityScore}</span>
                              <span className="text-xs text-gray-600">/100</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="bg-white rounded p-2">
                              <p className="text-xs text-gray-600">Freshness</p>
                              <p className={`text-sm font-semibold ${
                                formData.qualityCheck.freshness === 'Excellent' ? 'text-green-600' :
                                formData.qualityCheck.freshness === 'Good' ? 'text-blue-600' :
                                formData.qualityCheck.freshness === 'Fair' ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {formData.qualityCheck.freshness}
                              </p>
                            </div>
                            <div className="bg-white rounded p-2">
                              <p className="text-xs text-gray-600">Appearance</p>
                              <p className={`text-sm font-semibold ${
                                formData.qualityCheck.appearance === 'Excellent' ? 'text-green-600' :
                                formData.qualityCheck.appearance === 'Good' ? 'text-blue-600' :
                                formData.qualityCheck.appearance === 'Fair' ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {formData.qualityCheck.appearance}
                              </p>
                            </div>
                          </div>
                          
                          {formData.qualityCheck.qualityIndicators && formData.qualityCheck.qualityIndicators.length > 0 && (
                            <div className="mb-2">
                              <p className="text-xs text-gray-600 mb-1">Quality Indicators:</p>
                              <div className="flex flex-wrap gap-1">
                                {formData.qualityCheck.qualityIndicators.map((indicator, idx) => (
                                  <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    ✓ {indicator}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {formData.qualityCheck.recommendation && (
                            <div className="mt-2 text-xs text-gray-700 bg-white rounded p-2">
                              <strong>Recommendation:</strong> {formData.qualityCheck.recommendation}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-600 mt-3">Click the × to remove and upload a different image</p>
                    </div>
                  ) : (
                    // Upload Button
                    <div>
                      <div className="mx-auto w-16 h-16 mb-4 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                          />
                        </svg>
                      </div>
                      <label className="cursor-pointer">
                        <span className="inline-block bg-farm-green text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                          📎 Choose Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-sm text-gray-500 mt-3">or drag and drop an image here</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF (max 5MB)</p>
                    </div>
                  )}
                </div>

                {/* Optional: URL Input as Alternative */}
                <div className="mt-3">
                  <details className="text-sm">
                    <summary className="cursor-pointer text-gray-600 hover:text-farm-green">Or enter image URL manually</summary>
                    <input
                      type="url"
                      value={formData.image.startsWith('data:') ? '' : formData.image}
                      onChange={(e) => {
                        setFormData({...formData, image: e.target.value});
                        setImagePreview(e.target.value);
                      }}
                      className="w-full mt-2 border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-farm-green outline-none text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                  </details>
                </div>
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
