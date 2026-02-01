import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTranslation } from '../translations';

const FarmerProductsPage = ({ language }) => {
  const navigate = useNavigate();
  const { farmerId } = useParams();
  const t = (key) => getTranslation(language, key);
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [showToast, setShowToast] = useState(false);

  const farmersData = [
    {
      id: 1,
      name: 'Ramesh Kumar',
      location: 'Guntur, AP',
      distance: '2.5 km',
      rating: 4.8,
      reviews: 45,
      specialties: ['Fresh Vegetables', 'Leafy Greens'],
      products: [
        {
          id: 101,
          name: 'Fresh Tomatoes',
          price: 30,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
          inStock: true,
          quality: 'Premium',
          organic: true,
          stock: 100
        },
        {
          id: 102,
          name: 'Fresh Onions',
          price: 25,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
          inStock: true,
          quality: 'Grade A',
          stock: 80
        },
        {
          id: 103,
          name: 'Potatoes',
          price: 20,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
          inStock: true,
          quality: 'Premium',
          stock: 150
        },
        {
          id: 104,
          name: 'Organic Spinach',
          price: 35,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
          inStock: true,
          quality: 'Premium',
          organic: true,
          stock: 40
        },
        {
          id: 105,
          name: 'Fresh Cabbage',
          price: 22,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1594282153818-e9113d1f574f?w=400',
          inStock: true,
          quality: 'Grade A',
          stock: 60
        }
      ]
    },
    {
      id: 2,
      name: 'Suresh Reddy',
      location: 'Vijayawada, AP',
      distance: '5.2 km',
      rating: 4.6,
      reviews: 32,
      specialties: ['Organic Millets', 'Traditional Grains'],
      products: [
        {
          id: 201,
          name: 'Pearl Millet (Bajra)',
          price: 45,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
          inStock: true,
          quality: 'Organic',
          organic: true,
          stock: 200
        },
        {
          id: 202,
          name: 'Finger Millet (Ragi)',
          price: 50,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
          inStock: true,
          quality: 'Organic',
          organic: true,
          stock: 150
        },
        {
          id: 203,
          name: 'Organic Rice',
          price: 60,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
          inStock: true,
          quality: 'Premium',
          organic: true,
          stock: 300
        },
        {
          id: 204,
          name: 'Wheat Grains',
          price: 40,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
          inStock: true,
          quality: 'Grade A',
          stock: 250
        },
        {
          id: 205,
          name: 'Green Gram (Moong Dal)',
          price: 75,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
          inStock: true,
          quality: 'Premium',
          stock: 100
        }
      ]
    },
    {
      id: 3,
      name: 'Ganesh Patel',
      location: 'Bangalore, KA',
      distance: '3.8 km',
      rating: 4.9,
      reviews: 67,
      specialties: ['Seasonal Fruits', 'Exotic Produce'],
      products: [
        {
          id: 301,
          name: 'Alphonso Mangoes',
          price: 180,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400',
          inStock: true,
          quality: 'Premium',
          organic: true,
          stock: 50
        },
        {
          id: 302,
          name: 'Fresh Bananas',
          price: 40,
          unit: 'dozen',
          image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400',
          inStock: true,
          quality: 'Grade A',
          stock: 100
        },
        {
          id: 303,
          name: 'Kashmiri Apples',
          price: 150,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
          inStock: true,
          quality: 'Premium',
          stock: 80
        },
        {
          id: 304,
          name: 'Pomegranates',
          price: 120,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=400',
          inStock: true,
          quality: 'Premium',
          organic: true,
          stock: 60
        },
        {
          id: 305,
          name: 'Dragon Fruit',
          price: 200,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=400',
          inStock: true,
          quality: 'Exotic',
          stock: 30
        }
      ]
    },
    {
      id: 4,
      name: 'Lakshmi Devi',
      location: 'Hyderabad, TS',
      distance: '4.1 km',
      rating: 4.7,
      reviews: 38,
      specialties: ['Root Vegetables', 'Gourds'],
      products: [
        {
          id: 401,
          name: 'Fresh Carrots',
          price: 35,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
          inStock: true,
          quality: 'Premium',
          organic: true,
          stock: 75
        },
        {
          id: 402,
          name: 'Beetroot',
          price: 40,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc3?w=400',
          inStock: true,
          quality: 'Grade A',
          stock: 50
        },
        {
          id: 403,
          name: 'Bottle Gourd (Lauki)',
          price: 28,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1566842600175-97dca489844f?w=400',
          inStock: true,
          quality: 'Fresh',
          stock: 40
        },
        {
          id: 404,
          name: 'Bitter Gourd (Karela)',
          price: 32,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1589927986089-35812378d2dd?w=400',
          inStock: true,
          quality: 'Premium',
          organic: true,
          stock: 35
        },
        {
          id: 405,
          name: 'Pumpkin',
          price: 25,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400',
          inStock: true,
          quality: 'Grade A',
          stock: 90
        }
      ]
    },
    {
      id: 5,
      name: 'Krishna Murthy',
      location: 'Chennai, TN',
      distance: '6.3 km',
      rating: 4.5,
      reviews: 28,
      specialties: ['Citrus Fruits', 'Tropical Produce'],
      products: [
        {
          id: 501,
          name: 'Fresh Oranges',
          price: 60,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400',
          inStock: true,
          quality: 'Premium',
          stock: 120
        },
        {
          id: 502,
          name: 'Watermelon',
          price: 30,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400',
          inStock: true,
          quality: 'Sweet',
          stock: 80
        },
        {
          id: 503,
          name: 'Papaya',
          price: 40,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400',
          inStock: true,
          quality: 'Ripe',
          stock: 60
        },
        {
          id: 504,
          name: 'Fresh Guava',
          price: 50,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400',
          inStock: true,
          quality: 'Premium',
          organic: true,
          stock: 45
        },
        {
          id: 505,
          name: 'Pineapple',
          price: 45,
          unit: 'piece',
          image: 'https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=400',
          inStock: true,
          quality: 'Fresh',
          stock: 50
        }
      ]
    },
    {
      id: 6,
      name: 'Vijay Singh',
      location: 'Pune, MH',
      distance: '7.8 km',
      rating: 4.8,
      reviews: 52,
      specialties: ['Premium Vegetables', 'Herbs'],
      products: [
        {
          id: 601,
          name: 'Bell Peppers (Capsicum)',
          price: 80,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400',
          inStock: true,
          quality: 'Premium',
          organic: true,
          stock: 40
        },
        {
          id: 602,
          name: 'Fresh Brinjal (Eggplant)',
          price: 35,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1659261200910-8d6344e14ad6?w=400',
          inStock: true,
          quality: 'Grade A',
          stock: 55
        },
        {
          id: 603,
          name: 'Cauliflower',
          price: 45,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1568584711271-2638c8e2d1b6?w=400',
          inStock: true,
          quality: 'Premium',
          stock: 65
        },
        {
          id: 604,
          name: 'Green Chilli',
          price: 60,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400',
          inStock: true,
          quality: 'Hot & Fresh',
          organic: true,
          stock: 30
        },
        {
          id: 605,
          name: 'Fresh Cucumber',
          price: 28,
          unit: 'kg',
          image: 'https://images.unsplash.com/photo-1589927986089-35812378d2dd?w=400',
          inStock: true,
          quality: 'Crisp',
          stock: 70
        }
      ]
    }
  ];

  useEffect(() => {
    const farmerData = farmersData.find(f => f.id === parseInt(farmerId));
    if (farmerData) {
      setFarmer(farmerData);
      setProducts(farmerData.products);
    }
  }, [farmerId]);

  const handleAddToCart = (product) => {
    const updatedCart = { ...cart };
    const productKey = `${product.id}`;
    
    if (updatedCart[productKey]) {
      updatedCart[productKey].quantity += 1;
    } else {
      updatedCart[productKey] = {
        ...product,
        farmerId: farmer.id,
        farmerName: farmer.name,
        quantity: 1
      };
    }
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Show toast notification
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const getCartQuantity = (productId) => {
    return cart[productId]?.quantity || 0;
  };

  if (!farmer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading farmer products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-farm-green text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">{farmer.name}'s Products</h1>
          <button onClick={() => navigate('/buyer/cart')} className="p-2 relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {Object.keys(cart).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {Object.keys(cart).length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Farmer Info */}
      <div className="bg-white shadow-md p-6 mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              {farmer.name}
              <svg className="w-5 h-5 text-blue-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </h2>
            <p className="text-gray-600">{farmer.location} • {farmer.distance}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-yellow-500">⭐</span>
              <span className="font-bold">{farmer.rating}</span>
              <span className="text-gray-600">({farmer.reviews} reviews)</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {farmer.specialties.map((specialty, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="p-4 max-w-6xl mx-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Available Products ({products.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
            >
              {/* Product Image */}
              <div className="relative h-40">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.organic && (
                  <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Organic
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h4 className="font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h4>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                  <span className="text-gray-600">/{product.unit}</span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  <span className="font-semibold">Quality:</span> {product.quality}
                </div>
                
                {/* Stock Status */}
                {product.stock < 20 && (
                  <p className="text-orange-600 text-sm mb-2">Only {product.stock} {product.unit} left!</p>
                )}

                {/* Add to Cart Button */}
                {getCartQuantity(product.id) > 0 ? (
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-center font-semibold">
                    ✓ In Cart ({getCartQuantity(product.id)})
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-farm-green hover:bg-farm-dark-green text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View Cart Button */}
        {Object.keys(cart).length > 0 && (
          <div className="fixed bottom-4 left-4 right-4 z-40">
            <button
              onClick={() => navigate('/buyer/cart')}
              className="w-full bg-farm-green text-white font-bold py-4 rounded-xl shadow-2xl flex items-center justify-center space-x-2 hover:bg-farm-dark-green transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>View Cart ({Object.keys(cart).length} items)</span>
            </button>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center space-x-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">Added to cart!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerProductsPage;
