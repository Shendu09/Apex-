import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';
import { callGeminiAPI } from '../config/gemini';

const VoiceAssistant = ({ language, userType }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [showWaveform, setShowWaveform] = useState(false);
  const [isWakeWordListening, setIsWakeWordListening] = useState(false);
  const [showActivationPulse, setShowActivationPulse] = useState(false);
  
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const wakeWordRecognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const t = (key) => getTranslation(language, key);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      // Main recognition for commands
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      // Wake word recognition (continuous)
      wakeWordRecognitionRef.current = new SpeechRecognition();
      wakeWordRecognitionRef.current.continuous = true;
      wakeWordRecognitionRef.current.interimResults = true;
      
      // Set language based on user selection
      const langCodes = {
        english: 'en-US',
        hindi: 'hi-IN',
        telugu: 'te-IN',
        tamil: 'ta-IN',
        kannada: 'kn-IN'
      };
      const selectedLang = langCodes[language] || 'en-US';
      recognitionRef.current.lang = selectedLang;
      wakeWordRecognitionRef.current.lang = selectedLang;

      // Main recognition handlers
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setShowWaveform(true);
      };

      recognitionRef.current.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        processCommand(speechResult);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setShowWaveform(false);
        if (event.error === 'no-speech') {
          speak("I didn't hear anything. Please try again.");
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setShowWaveform(false);
      };

      // Wake word recognition handlers
      wakeWordRecognitionRef.current.onresult = (event) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript.toLowerCase();
        
        // Check for wake words
        if (text.includes('hey tomme') || text.includes('tomme') || text.includes('tommy')) {
          console.log('Wake word detected:', text);
          setShowActivationPulse(true);
          setIsOpen(true);
          
          // Play activation sound/feedback
          speak("Yes, I'm listening!");
          
          // Stop wake word listening and start command listening
          wakeWordRecognitionRef.current.stop();
          setTimeout(() => {
            if (recognitionRef.current && !isListening) {
              recognitionRef.current.start();
            }
          }, 1500);
          
          setTimeout(() => setShowActivationPulse(false), 1000);
        }
      };

      wakeWordRecognitionRef.current.onerror = (event) => {
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.error('Wake word recognition error:', event.error);
        }
        // Restart wake word listening
        if (isWakeWordListening) {
          setTimeout(() => {
            try {
              wakeWordRecognitionRef.current.start();
            } catch (e) {
              console.log('Could not restart wake word detection');
            }
          }, 1000);
        }
      };

      wakeWordRecognitionRef.current.onend = () => {
        // Restart wake word listening if enabled
        if (isWakeWordListening) {
          setTimeout(() => {
            try {
              wakeWordRecognitionRef.current.start();
            } catch (e) {
              console.log('Could not restart wake word detection');
            }
          }, 100);
        }
      };

      // Start wake word detection
      startWakeWordDetection();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (wakeWordRecognitionRef.current) {
        wakeWordRecognitionRef.current.stop();
      }
      synthRef.current.cancel();
    };
  }, [language]);

  const startWakeWordDetection = () => {
    if (wakeWordRecognitionRef.current) {
      try {
        setIsWakeWordListening(true);
        wakeWordRecognitionRef.current.start();
        console.log('Wake word detection started - say "Hey Tomme" or "Tomme"');
      } catch (e) {
        console.log('Wake word detection already running');
      }
    }
  };

  const stopWakeWordDetection = () => {
    if (wakeWordRecognitionRef.current) {
      setIsWakeWordListening(false);
      wakeWordRecognitionRef.current.stop();
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setResponse('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text) => {
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice based on language
    const voices = synthRef.current.getVoices();
    const langCodes = {
      english: 'en',
      hindi: 'hi',
      telugu: 'te',
      tamil: 'ta',
      kannada: 'kn'
    };
    const preferredLang = langCodes[language] || 'en';
    const voice = voices.find(v => v.lang.startsWith(preferredLang)) || voices[0];
    
    if (voice) utterance.voice = voice;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    setResponse(text);
    synthRef.current.speak(utterance);
  };

  const processCommand = async (command) => {
    const lowerCommand = command.toLowerCase();
    
    // Get real-time app data for context
    const products = JSON.parse(localStorage.getItem('farmerProducts') || '[]');
    const allProducts = JSON.parse(localStorage.getItem('allAvailableProducts') || '[]');
    const orders = JSON.parse(localStorage.getItem(`${userType}Orders`) || '[]');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Create rich context for Gemini
    const context = `You are Tomme, a friendly and intelligent voice assistant for Farm Bridge, an agricultural marketplace app connecting farmers and buyers.

CURRENT USER:
- User Type: ${userType}
- Language: ${language}

AVAILABLE APP PAGES & ROUTES:
- Dashboard: /${userType}/dashboard
- Products: /${userType === 'farmer' ? '/farmer/products' : '/buyer/products'}
- Orders: /${userType}/orders
- Order Tracking: /${userType}/tracking
- Profile: /${userType}/profile
- Cart: /buyer/cart (buyer only)
- Discover Farmers: /buyer/discover (buyer only)
- Categories: /buyer/products?category=vegetables|fruits|grains|dairy

CURRENT DATA IN APP:
Products Available: ${allProducts.length} items
${allProducts.slice(0, 5).map(p => `- ${p.name}: ₹${p.price}/${p.unit}, ${p.available ? 'Available' : 'Out of stock'}, ${p.organic ? 'Organic' : 'Regular'}`).join('\n')}
${allProducts.length > 5 ? `...and ${allProducts.length - 5} more items` : ''}

Active Orders: ${orders.length}
Cart Items: ${cart.length}

USER COMMAND: "${command}"

INSTRUCTIONS:
1. Be conversational, friendly, and natural - like Alexa or Siri
2. Understand intent even if phrased casually (e.g., "show me stuff" → navigate to products)
3. Provide detailed information about products, prices, reviews when asked
4. Answer questions about product quality, availability, prices
5. Help with navigation, but also chat naturally about anything app-related
6. If user asks about specific products, give details from the data above
7. If discussing products, mention prices, quality, availability naturally
8. Be helpful and proactive - suggest actions when appropriate

RESPONSE FORMAT (JSON):
{
  "action": "navigate" | "respond" | "chat",
  "route": "/path/to/page" (if navigating),
  "response": "Conversational, natural response to user. Be detailed when discussing products/orders. Be friendly!",
  "shouldNavigate": true | false,
  "productInfo": "If discussing products, include specific details here"
}

Examples:
- "I want to buy some" → Navigate to products, say "Sure! Let me show you our available products. We have fresh vegetables, fruits, and more!"
- "What's available?" → Respond with product details without navigating
- "Tell me about tomatoes" → Share price, quality, availability from data
- "How much for onions?" → Give price and details if available
- "Are there organic products?" → List organic items from data

Respond naturally and be helpful!`;

    try {
      // Get intelligent response from Gemini
      const geminiResponse = await callGeminiAPI(context);
      
      if (geminiResponse) {
        // Try to parse JSON response
        const jsonMatch = geminiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          
          // Speak the response
          speak(parsed.response);
          
          // Navigate if needed
          if (parsed.shouldNavigate && parsed.route) {
            setTimeout(() => {
              console.log('Navigating to:', parsed.route);
              navigate(parsed.route);
            }, 2000);
          }
          return;
        } else {
          // If JSON parsing fails, just speak the response
          speak(geminiResponse);
          return;
        }
      }
    } catch (error) {
      console.log('Gemini API failed, using fallback:', error);
    }

    // Fallback to rule-based processing
    processCommandFallback(lowerCommand);
  };

  const processCommandFallback = (lowerCommand) => {
    // Check for product-related queries first
    const products = JSON.parse(localStorage.getItem('allAvailableProducts') || '[]');
    
    // Product information queries
    if (lowerCommand.includes('available') || lowerCommand.includes('what do you have') || lowerCommand.includes('show me')) {
      if (products.length > 0) {
        const categories = [...new Set(products.map(p => p.category))];
        speak(`We have ${products.length} products available including ${categories.join(', ')}. Would you like me to show them to you?`);
        setTimeout(() => navigate(`/${userType}/products`), 2000);
        return;
      }
    }
    
    // Price queries
    if (lowerCommand.includes('price') || lowerCommand.includes('cost') || lowerCommand.includes('how much')) {
      const matchedProduct = products.find(p => 
        lowerCommand.includes(p.name.toLowerCase())
      );
      if (matchedProduct) {
        speak(`${matchedProduct.name} costs ₹${matchedProduct.price} per ${matchedProduct.unit}. ${matchedProduct.organic ? 'This is an organic product.' : ''} ${matchedProduct.available ? 'It\'s currently in stock!' : 'Sorry, it\'s out of stock right now.'}`);
        return;
      }
    }
    
    // Quality/review queries
    if (lowerCommand.includes('quality') || lowerCommand.includes('review') || lowerCommand.includes('good') || lowerCommand.includes('fresh')) {
      const qualityProducts = products.filter(p => p.qualityCheck && p.qualityCheck.qualityScore >= 75);
      if (qualityProducts.length > 0) {
        const avgScore = Math.round(qualityProducts.reduce((sum, p) => sum + p.qualityCheck.qualityScore, 0) / qualityProducts.length);
        speak(`All our products go through AI quality checks! We have ${qualityProducts.length} products with high quality scores. Average quality score is ${avgScore} out of 100. Our farmers maintain excellent freshness standards. Would you like to see these products?`);
        setTimeout(() => navigate(`/${userType}/products`), 3000);
        return;
      }
      speak(`All our products are directly from farmers ensuring maximum freshness. We have ${products.filter(p => p.organic).length} organic certified products. Our farmers maintain high quality standards. Would you like to see the products?`);
      setTimeout(() => navigate(`/${userType}/products`), 2500);
      return;
    }
    
    // Organic queries
    if (lowerCommand.includes('organic')) {
      const organicProducts = products.filter(p => p.organic);
      if (organicProducts.length > 0) {
        speak(`We have ${organicProducts.length} organic products available. ${organicProducts.slice(0, 3).map(p => p.name).join(', ')} and more. Let me show them to you!`);
        setTimeout(() => navigate(`/${userType}/products`), 2500);
        return;
      }
    }
    
    // Navigation commands
    if (lowerCommand.includes('dashboard') || lowerCommand.includes('home')) {
      speak(`Taking you to your ${userType} dashboard`);
      setTimeout(() => navigate(`/${userType}/dashboard`), 1500);
    }
    else if (lowerCommand.includes('product') && (lowerCommand.includes('add') || lowerCommand.includes('manage'))) {
      speak('Opening product management where you can add and manage your products');
      setTimeout(() => navigate('/farmer/products'), 1500);
    }
    else if (lowerCommand.includes('order')) {
      const orders = JSON.parse(localStorage.getItem(`${userType}Orders`) || '[]');
      speak(`You have ${orders.length} orders. Opening your orders page`);
      setTimeout(() => navigate(`/${userType}/orders`), 1500);
    }
    else if (lowerCommand.includes('track')) {
      speak('Opening order tracking so you can see delivery status');
      setTimeout(() => navigate(`/${userType}/tracking`), 1500);
    }
    else if (lowerCommand.includes('profile')) {
      speak('Opening your profile');
      setTimeout(() => navigate(`/${userType}/profile`), 1500);
    }
    else if (lowerCommand.includes('cart')) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      speak(`You have ${cart.length} items in your cart. Opening it now`);
      setTimeout(() => navigate('/buyer/cart'), 1500);
    }
    else if (lowerCommand.includes('discover') || lowerCommand.includes('find farmer')) {
      speak('Let me help you discover local farmers near you');
      setTimeout(() => navigate('/buyer/discover'), 1500);
    }
    else if (lowerCommand.includes('vegetable')) {
      const veggies = products.filter(p => p.category === 'vegetables');
      speak(`We have ${veggies.length} fresh vegetables available. Showing them now!`);
      setTimeout(() => navigate('/buyer/products?category=vegetables'), 1500);
    }
    else if (lowerCommand.includes('fruit')) {
      const fruits = products.filter(p => p.category === 'fruits');
      speak(`We have ${fruits.length} fresh fruits available. Let me show you!`);
      setTimeout(() => navigate('/buyer/products?category=fruits'), 1500);
    }
    else if (lowerCommand.includes('grain')) {
      speak('Showing grains and cereals');
      setTimeout(() => navigate('/buyer/products?category=grains'), 1500);
    }
    
    // Conversational
    else if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
      speak(`Hi! I'm Tomme, your Farm Bridge assistant. I can help you navigate, find products, check prices and availability, discuss product quality, manage orders, and much more! Try asking me things like "What's available?", "Show me organic products", "How much for tomatoes?", or just tell me where you want to go!`);
    }
    else if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      speak(`Hello! I'm Tomme, your friendly assistant. How can I help you today? You can ask me about products, prices, orders, or tell me where you'd like to go!`);
    }
    else if (lowerCommand.includes('thank')) {
      speak('You\'re very welcome! I\'m always here to help. Just say my name anytime!');
    }
    else if (lowerCommand.includes('time')) {
      const now = new Date();
      speak(`The time is ${now.toLocaleTimeString()}`);
    }
    else if (lowerCommand.includes('date')) {
      const now = new Date();
      speak(`Today is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
    }
    
    // Default - be helpful
    else {
      speak('I can help you with that! Try being more specific - you can ask me about products, prices, quality, orders, or tell me where you want to go. For example, say "show me products" or "how much for tomatoes" or "open dashboard"');
    }
  };

  return (
    <>
      {/* Floating Assistant Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 z-50 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-full w-16 h-16 shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-110 flex items-center justify-center ${
          showActivationPulse ? 'animate-ping' : ''
        }`}
        style={{ animation: isWakeWordListening ? 'pulse 2s infinite' : 'none' }}
      >
        <div className="text-2xl">{isWakeWordListening ? '🎙️' : '🤖'}</div>
      </button>

      {/* Wake Word Indicator */}
      {isWakeWordListening && !isOpen && (
        <div className="fixed bottom-44 right-6 z-40 bg-purple-500 text-white px-4 py-2 rounded-full text-xs shadow-lg animate-pulse">
          Say "Hey Tomme" 🎤
        </div>
      )}

      {/* Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-44 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-lg">Tomme</h3>
                <p className="text-xs opacity-90">{t('voiceAssistant')}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {/* Avatar with Animation */}
            <div className="flex justify-center mb-4">
              <div className={`relative w-24 h-24 ${isListening || isSpeaking ? 'animate-bounce' : ''}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  isListening ? 'from-red-400 to-pink-400' :
                  isSpeaking ? 'from-green-400 to-blue-400' :
                  'from-purple-400 to-blue-400'
                } rounded-full flex items-center justify-center text-4xl`}>
                  {isListening ? '👂' : isSpeaking ? '💬' : '🤖'}
                </div>
                
                {/* Waveform Animation */}
                {showWaveform && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-purple-500 rounded-full animate-waveform"
                        style={{
                          height: '20px',
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status Text */}
            <div className="text-center mb-4">
              <p className={`text-sm font-semibold ${
                isListening ? 'text-red-500' :
                isSpeaking ? 'text-green-500' :
                'text-gray-500'
              }`}>
                {isListening ? `🎤 ${t('listening')}` :
                 isSpeaking ? '🔊 Speaking...' :
                 t('tapToSpeak')}
              </p>
            </div>

            {/* Transcript */}
            {transcript && (
              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <p className="text-xs text-gray-500 mb-1">{t('youSaid')}</p>
                <p className="text-sm text-gray-800">{transcript}</p>
              </div>
            )}

            {/* Response */}
            {response && (
              <div className="bg-purple-50 rounded-lg p-3 mb-3">
                <p className="text-xs text-gray-500 mb-1">Tomme:</p>
                <p className="text-sm text-gray-800">{response}</p>
              </div>
            )}

            {/* Quick Commands */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">{t('trySaying')}</p>
              <div className="space-y-2">
                <button
                  onClick={() => processCommand('open dashboard')}
                  className="w-full text-left text-xs bg-gray-100 hover:bg-gray-200 rounded-lg p-2 transition-colors"
                >
                  💼 "{t('openDashboard')}"
                </button>
                <button
                  onClick={() => processCommand('show my orders')}
                  className="w-full text-left text-xs bg-gray-100 hover:bg-gray-200 rounded-lg p-2 transition-colors"
                >
                  📦 "{t('showMyOrders')}"
                </button>
                <button
                  onClick={() => processCommand('help')}
                  className="w-full text-left text-xs bg-gray-100 hover:bg-gray-200 rounded-lg p-2 transition-colors"
                >
                  ❓ "{t('help')}"
                </button>
              </div>
            </div>
          </div>

          {/* Microphone Button */}
          <div className="p-4 bg-gray-50 border-t">
            <div className="flex justify-center space-x-3">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                } text-white rounded-full w-16 h-16 shadow-lg transform transition-all hover:scale-110 flex items-center justify-center text-3xl`}
              >
                {isListening ? '⏸️' : '🎙️'}
              </button>
              
              <button
                onClick={isWakeWordListening ? stopWakeWordDetection : startWakeWordDetection}
                className={`${
                  isWakeWordListening 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-400 hover:bg-gray-500'
                } text-white rounded-full w-16 h-16 shadow-lg transform transition-all hover:scale-110 flex items-center justify-center text-2xl relative`}
                title={isWakeWordListening ? 'Wake word ON' : 'Wake word OFF'}
              >
                👂
                {isWakeWordListening && (
                  <span className="absolute -top-1 -right-1 bg-green-400 rounded-full w-4 h-4 animate-ping"></span>
                )}
              </button>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">
              {isWakeWordListening ? '👂 Say "Hey Tomme" to activate' : '👆 Tap ear to enable wake word'}
            </p>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes waveform {
          0%, 100% { height: 8px; }
          50% { height: 24px; }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-waveform {
          animation: waveform 0.6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default VoiceAssistant;
