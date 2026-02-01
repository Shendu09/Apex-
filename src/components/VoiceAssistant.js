import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  
  // Advanced Siri-like features
  const [conversationHistory, setConversationHistory] = useState([]);
  const [contextMemory, setContextMemory] = useState({});
  const [userPreferences, setUserPreferences] = useState({});
  const [isThinking, setIsThinking] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [emotionalState, setEmotionalState] = useState('neutral');
  const [continuousMode, setContinuousMode] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const recognitionRef = useRef(null);
  const wakeWordRecognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const conversationTimeoutRef = useRef(null);

  // Load user preferences and history from localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('voiceAssistantPreferences');
    const savedHistory = localStorage.getItem('conversationHistory');
    
    if (savedPrefs) {
      setUserPreferences(JSON.parse(savedPrefs));
    }
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      // Keep only last 20 conversations for context
      setConversationHistory(history.slice(-20));
    }
  }, []);

  // Save preferences and history
  useEffect(() => {
    if (Object.keys(userPreferences).length > 0) {
      localStorage.setItem('voiceAssistantPreferences', JSON.stringify(userPreferences));
    }
  }, [userPreferences]);

  useEffect(() => {
    if (conversationHistory.length > 0) {
      localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
    }
  }, [conversationHistory]);

  // Proactive suggestions based on context
  useEffect(() => {
    const generateProactiveSuggestions = async () => {
      const currentHour = new Date().getHours();
      const currentPath = location.pathname;
      const products = JSON.parse(localStorage.getItem('allAvailableProducts') || '[]');
      const orders = JSON.parse(localStorage.getItem(`${userType}Orders`) || '[]');
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');

      let newSuggestions = [];

      // Time-based suggestions
      if (currentHour >= 6 && currentHour < 12) {
        newSuggestions.push("Good morning! Would you like to check today's fresh arrivals?");
      } else if (currentHour >= 12 && currentHour < 17) {
        newSuggestions.push("Need anything for today's cooking?");
      } else if (currentHour >= 17) {
        newSuggestions.push("Planning tomorrow's meals? Let me help you shop!");
      }

      // Context-based suggestions
      if (currentPath.includes('products') && cart.length > 0) {
        newSuggestions.push(`You have ${cart.length} items in cart. Ready to checkout?`);
      }

      if (orders.some(o => o.status === 'pending' || o.status === 'processing')) {
        newSuggestions.push("You have orders in progress. Want to track them?");
      }

      if (userType === 'buyer' && products.filter(p => p.organic).length > 5 && !contextMemory.askedAboutOrganic) {
        newSuggestions.push("Did you know we have organic products? Want to see them?");
      }

      if (userType === 'farmer' && products.length === 0) {
        newSuggestions.push("Ready to add your first product? I can guide you!");
      }

      setSuggestions(newSuggestions.slice(0, 2));
    };

    generateProactiveSuggestions();
    const interval = setInterval(generateProactiveSuggestions, 60000); // Every minute

    return () => clearInterval(interval);
  }, [location.pathname, userType, contextMemory]);

  // Initialize Speech Recognition with advanced features
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      // Main recognition for commands - enhanced with interim results
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Continuous listening
      recognitionRef.current.interimResults = true; // Show real-time transcription
      recognitionRef.current.maxAlternatives = 3; // Get multiple interpretation options
      
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

      // Main recognition handlers - Enhanced
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setShowWaveform(true);
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscriptText = '';
        let finalTranscriptText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscriptText += transcript + ' ';
          } else {
            interimTranscriptText += transcript;
          }
        }

        // Update interim transcript for real-time feedback
        if (interimTranscriptText) {
          setInterimTranscript(interimTranscriptText);
        }

        // Process final transcript
        if (finalTranscriptText.trim()) {
          setInterimTranscript('');
          const fullTranscript = finalTranscriptText.trim();
          setTranscript(fullTranscript);
          processCommand(fullTranscript);

          // In continuous mode, keep listening
          if (continuousMode) {
            // Reset the timeout for auto-stop - wait 45 seconds!
            clearTimeout(conversationTimeoutRef.current);
            conversationTimeoutRef.current = setTimeout(() => {
              if (continuousMode && !isSpeaking) {
                speak("I'm still here. Anything else?");
                // Give another 20 seconds after this
                setTimeout(() => {
                  if (continuousMode) {
                    stopListening();
                    setContinuousMode(false);
                  }
                }, 20000);
              }
            }, 45000); // 45 seconds!
          } else {
            // Single command mode - wait a bit before stopping
            // Don't auto-stop, let user finish naturally
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'no-speech') {
          // Silently restart after 2 seconds - user might still be thinking
          setTimeout(() => {
            if (recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                console.log('Could not restart listening');
              }
            }
          }, 2000);
          return;
        } else if (event.error === 'audio-capture') {
          speak("I'm having trouble with the microphone. Please check your mic permissions.");
          setIsListening(false);
          setShowWaveform(false);
        } else if (event.error === 'not-allowed') {
          speak("I need microphone permission to work. Please enable it in your browser settings.");
          setIsListening(false);
          setShowWaveform(false);
        }
      };

      recognitionRef.current.onend = () => {
        // Always auto-restart to keep listening - wait a bit longer
        if (isListening || continuousMode) {
          setTimeout(() => {
            try {
              recognitionRef.current.start();
              console.log('Auto-restarted listening');
            } catch (e) {
              console.log('Could not restart recognition');
            }
          }, 500);
        } else {
          setIsListening(false);
          setShowWaveform(false);
          setInterimTranscript('');
        }
      };

      // Wake word recognition handlers - Enhanced
      wakeWordRecognitionRef.current.onresult = (event) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript.toLowerCase();
        
        // Multiple wake word variations
        const wakeWords = ['hey tomme', 'tomme', 'tommy', 'hey tommy', 'ok tomme', 'okay tomme'];
        const hasWakeWord = wakeWords.some(word => text.includes(word));
        
        if (hasWakeWord) {
          console.log('Wake word detected:', text);
          setShowActivationPulse(true);
          setIsOpen(true);
          
          // Generate contextual greeting
          const greetings = [
            "Yes, I'm here! How can I help?",
            "Hello! What would you like to know?",
            "I'm listening! What can I do for you?",
            "Ready to assist! What do you need?",
            "Hi there! How may I help you today?"
          ];
          const greeting = greetings[Math.floor(Math.random() * greetings.length)];
          
          speak(greeting);
          
          // Stop wake word listening and start command listening
          wakeWordRecognitionRef.current.stop();
          
          // Enable continuous conversation mode
          setContinuousMode(true);
          
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      synthRef.current.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Enhanced speak function with emotional intelligence
  const speak = useCallback((text, options = {}) => {
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice based on language with preference for quality voices
    const voices = synthRef.current.getVoices();
    const langCodes = {
      english: 'en',
      hindi: 'hi',
      telugu: 'te',
      tamil: 'ta',
      kannada: 'kn'
    };
    const preferredLang = langCodes[language] || 'en';
    
    // Try to find Google or high-quality voices first
    let voice = voices.find(v => 
      v.lang.startsWith(preferredLang) && 
      (v.name.includes('Google') || v.name.includes('Premium'))
    );
    
    if (!voice) {
      voice = voices.find(v => v.lang.startsWith(preferredLang));
    }
    
    if (!voice) {
      voice = voices[0];
    }
    
    if (voice) utterance.voice = voice;
    
    // Adjust speech parameters based on emotional state and context
    switch (emotionalState) {
      case 'excited':
        utterance.rate = 1.1;
        utterance.pitch = 1.2;
        break;
      case 'calm':
        utterance.rate = 0.85;
        utterance.pitch = 0.9;
        break;
      case 'urgent':
        utterance.rate = 1.15;
        utterance.pitch = 1.1;
        break;
      default:
        utterance.rate = options.rate || 0.95;
        utterance.pitch = options.pitch || 1.0;
    }
    
    utterance.volume = options.volume || 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      // Pause listening while speaking to avoid feedback
      if (isListening && continuousMode) {
        recognitionRef.current.stop();
      }
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      // Resume listening in continuous mode
      if (continuousMode && !isListening) {
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.log('Could not resume listening');
          }
        }, 300);
      }
    };

    setResponse(text);
    
    // Add to conversation history
    setConversationHistory(prev => [...prev, {
      type: 'assistant',
      message: text,
      timestamp: Date.now(),
      emotion: emotionalState
    }]);
    
    synthRef.current.speak(utterance);
  }, [language, emotionalState, isListening, continuousMode]);

  // Advanced command processing with context awareness and AI
  const processCommand = async (command) => {
    const lowerCommand = command.toLowerCase();
    
    // Add to conversation history
    setConversationHistory(prev => [...prev, {
      type: 'user',
      message: command,
      timestamp: Date.now()
    }]);
    
    setIsThinking(true);
    
    // Detect emotion/sentiment from user's voice/text
    const detectEmotion = (text) => {
      const urgentWords = ['urgent', 'quickly', 'fast', 'asap', 'immediately', 'now', 'hurry'];
      const happyWords = ['great', 'awesome', 'excellent', 'wonderful', 'love', 'amazing', 'fantastic'];
      const frustratedWords = ['problem', 'issue', 'wrong', 'not working', 'error', 'broken', 'help'];
      
      if (urgentWords.some(word => text.includes(word))) return 'urgent';
      if (happyWords.some(word => text.includes(word))) return 'excited';
      if (frustratedWords.some(word => text.includes(word))) return 'calm';
      return 'neutral';
    };
    
    setEmotionalState(detectEmotion(lowerCommand));
    
    // Get real-time app data for context
    const products = JSON.parse(localStorage.getItem('farmerProducts') || '[]');
    const allProducts = JSON.parse(localStorage.getItem('allAvailableProducts') || '[]');
    const orders = JSON.parse(localStorage.getItem(`${userType}Orders`) || '[]');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Update context memory
    setContextMemory(prev => ({
      ...prev,
      lastCommand: command,
      lastCommandTime: Date.now(),
      currentPage: location.pathname,
      productsViewed: (prev.productsViewed || 0) + (lowerCommand.includes('product') ? 1 : 0),
      ordersChecked: (prev.ordersChecked || 0) + (lowerCommand.includes('order') ? 1 : 0),
    }));
    
    // Build smart, context-aware prompt for AI
    const recentHistory = conversationHistory.slice(-3).map(h => 
      `${h.type === 'user' ? 'User' : 'You'}: ${h.message}`
    ).join('\n');
    
    const organicCount = allProducts.filter(p => p.organic).length;
    const categories = [...new Set(allProducts.map(p => p.category))];
    const topProducts = allProducts.slice(0, 3).map(p => 
      `${p.name} (₹${p.price}/${p.unit}, ${p.category}${p.organic ? ', organic' : ''})`
    ).join(', ');
    
    const context = `You are Tomme, a smart AI assistant. Give VARIED, CONTEXTUAL responses - never repeat the same answer twice!

Current situation:
- User is on: ${location.pathname}
- User type: ${userType}
- Available: ${allProducts.length} products (${topProducts})
- Categories: ${categories.join(', ')}
- Organic items: ${organicCount}
- Cart: ${cart.length} items
- Orders: ${orders.length}

Recent chat:
${recentHistory || 'First interaction'}

User just said: "${command}"

YOUR TASK:
1. Give a SHORT (1-2 sentences), SMART answer
2. VARY your responses - be creative, don't repeat phrases
3. If user wants info → give specific details (prices, names, counts)
4. If user wants navigation → navigate + confirm
5. Be CONTEXTUAL - use the data above
6. Sound natural like ChatGPT, not robotic

Navigation routes:
- Products: /${userType}/products
- Orders: /${userType}/orders
- Dashboard: /${userType}/dashboard
- Profile: /${userType}/profile
- Cart: /buyer/cart
- Categories: /${userType}/products?category=vegetables|fruits|grains

Respond in JSON:
{
  "response": "Smart, varied, SHORT answer with specific details",
  "shouldNavigate": true/false,
  "route": "/exact/path" (if navigating)
}

Examples (notice variety):
"What's available?" → {"response": "We have ${allProducts.length} items including ${topProducts.split(',')[0]}. Let me show you!", "shouldNavigate": true, "route": "/${userType}/products"}
"Show products" → {"response": "Sure! Here are all ${allProducts.length} products.", "shouldNavigate": true, "route": "/${userType}/products"}
"Show me products" → {"response": "Opening the product catalog now with ${categories.length} categories!", "shouldNavigate": true, "route": "/${userType}/products"}
"Organic products" → {"response": "Found ${organicCount} organic items. Taking you there!", "shouldNavigate": true, "route": "/${userType}/products"}
"How much for tomatoes?" → Find tomato in data and say "Tomatoes are ₹X per kg. Want to see more vegetables?"
"My orders" → {"response": "You have ${orders.length} orders. Let's check them!", "shouldNavigate": true, "route": "/${userType}/orders"}

BE SMART, SPECIFIC, and VARY responses!`;

    try {
      setIsThinking(true);
      
      // Get intelligent response from Gemini AI
      const geminiResponse = await callGeminiAPI(context);
      
      setIsThinking(false);
      
      if (geminiResponse) {
        // Try to parse JSON response
        const jsonMatch = geminiResponse.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            
            // Speak the response (SHORT response)
            speak(parsed.response || geminiResponse);
            
            // Navigate if needed
            if (parsed.shouldNavigate && parsed.route) {
              setTimeout(() => {
                navigate(parsed.route);
              }, 1500);
            }
            
            return;
          } catch (parseError) {
            console.log('JSON parse failed');
          }
        }
        
        // If JSON parsing fails, extract short answer
        const shortResponse = geminiResponse.split('.').slice(0, 2).join('.') + '.';
        speak(shortResponse);
        return;
      }
    } catch (error) {
      console.log('AI failed, using fallback:', error);
    }
    
    setIsThinking(false);
    
    // Enhanced fallback with better understanding
    processCommandFallback(lowerCommand, command);
  };

  // Execute complex actions
  const executeAction = async (action) => {
    switch (action.type) {
      case 'addToCart':
        const product = action.data;
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        break;
      
      case 'filter':
        // Apply filters to products
        break;
      
      case 'compare':
        // Compare products
        break;
        
      case 'placeOrder':
        // Navigate to checkout
        setTimeout(() => navigate('/buyer/checkout'), 2000);
        break;
        
      default:
        break;
    }
  };

  const processCommandFallback = (lowerCommand, originalCommand) => {
    // Smart fallback with VARIED, contextual answers
    const products = JSON.parse(localStorage.getItem('allAvailableProducts') || '[]');
    const orders = JSON.parse(localStorage.getItem(`${userType}Orders`) || '[]');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const organicCount = products.filter(p => p.organic).length;
    const categories = [...new Set(products.map(p => p.category))];
    
    // Random greeting variations
    const greetings = [
      "Hello! What can I do for you?",
      "Hi there! How can I help?",
      "Hey! What do you need?",
      "Greetings! How may I assist you?"
    ];
    
    // Random confirmation phrases
    const confirmations = [
      "Sure thing!",
      "Got it!",
      "On it!",
      "Coming right up!",
      "Perfect!"
    ];
    
    const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    // Handle follow-ups
    if ((lowerCommand.includes('yes') || lowerCommand.includes('sure') || lowerCommand.includes('okay')) && pendingAction) {
      if (pendingAction.type === 'navigate') {
        speak(getRandomItem(confirmations) + " Taking you there now!");
        navigate(pendingAction.route);
        setPendingAction(null);
        return;
      }
    }
    
    if (lowerCommand.includes('no') && pendingAction) {
      speak("No problem! What else would you like to know?");
      setPendingAction(null);
      return;
    }
    
    // SMART Product queries with VARIETY
    if (lowerCommand.includes('available') || lowerCommand.includes('what') || lowerCommand.includes('show')) {
      if (lowerCommand.includes('product')) {
        const responses = [
          `We've got ${products.length} fresh items! Let me show you.`,
          `${products.length} products ready for you. Opening catalog!`,
          `Check out our ${products.length} products across ${categories.length} categories!`,
          `${products.length} items available. Here they are!`
        ];
        speak(getRandomItem(responses));
        setTimeout(() => navigate(`/${userType}/products`), 1000);
        return;
      }
    }
    
    // Smart price queries
    if (lowerCommand.includes('price') || lowerCommand.includes('cost') || lowerCommand.includes('how much')) {
      const words = lowerCommand.split(' ');
      const matchedProduct = products.find(p => 
        words.some(word => p.name.toLowerCase().includes(word))
      );
      
      if (matchedProduct) {
        const responses = [
          `${matchedProduct.name} costs ₹${matchedProduct.price} per ${matchedProduct.unit}${matchedProduct.organic ? '. It\'s organic!' : '.'}`,
          `That's ₹${matchedProduct.price} per ${matchedProduct.unit} for ${matchedProduct.name}${matchedProduct.organic ? ' - organic certified' : ''}.`,
          `₹${matchedProduct.price}/${matchedProduct.unit} for ${matchedProduct.name}. ${matchedProduct.available ? 'In stock!' : 'Currently unavailable.'}`,
          `${matchedProduct.name}: ₹${matchedProduct.price} per ${matchedProduct.unit}. Want to add it to cart?`
        ];
        speak(getRandomItem(responses));
        return;
      }
      speak("Which product's price would you like to know?");
      return;
    }
    
    // Organic with variety
    if (lowerCommand.includes('organic')) {
      const responses = [
        `Found ${organicCount} organic products! Let's check them out.`,
        `We have ${organicCount} certified organic items. Opening them now!`,
        `${organicCount} organic options available. Here you go!`,
        `${organicCount} organic products ready. Let me show you!`
      ];
      speak(getRandomItem(responses));
      setTimeout(() => navigate(`/${userType}/products`), 1000);
      return;
    }
    
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
    
    // Navigation with smart variety
    if (lowerCommand.includes('dashboard') || lowerCommand.includes('home')) {
      const responses = ["Taking you home!", "Opening your dashboard!", "Going to dashboard now!", "Dashboard coming up!"];
      speak(getRandomItem(responses));
      setTimeout(() => navigate(`/${userType}/dashboard`), 800);
    }
    else if (lowerCommand.includes('order')) {
      const responses = [
        `You have ${orders.length} orders. Let's check them!`,
        `${orders.length} orders found. Opening now!`,
        `Checking your ${orders.length} orders!`,
        `Here are your ${orders.length} orders!`
      ];
      speak(getRandomItem(responses));
      setTimeout(() => navigate(`/${userType}/orders`), 800);
    }
    else if (lowerCommand.includes('track')) {
      const responses = ["Opening tracking!", "Let's track your orders!", "Order tracking coming up!", "Tracking page loading!"];
      speak(getRandomItem(responses));
      setTimeout(() => navigate(`/${userType}/tracking`), 800);
    }
    else if (lowerCommand.includes('profile')) {
      const responses = ["Opening your profile!", "Here's your profile!", "Profile page loading!", "Going to profile!"];
      speak(getRandomItem(responses));
      setTimeout(() => navigate(`/${userType}/profile`), 800);
    }
    else if (lowerCommand.includes('cart')) {
      const responses = [
        `${cart.length} items in cart. Opening it!`,
        `Your cart has ${cart.length} items. Let's see!`,
        `Checking your cart with ${cart.length} items!`,
        `Cart: ${cart.length} items. Here you go!`
      ];
      speak(getRandomItem(responses));
      setTimeout(() => navigate('/buyer/cart'), 800);
    }
    else if (lowerCommand.includes('vegetable')) {
      const veggieCount = products.filter(p => p.category === 'vegetables').length;
      const responses = [
        `${veggieCount} fresh vegetables available!`,
        `Showing ${veggieCount} veggies now!`,
        `Found ${veggieCount} vegetables. Here they are!`,
        `${veggieCount} vegetable options for you!`
      ];
      speak(getRandomItem(responses));
      setTimeout(() => navigate('/buyer/products?category=vegetables'), 800);
    }
    else if (lowerCommand.includes('fruit')) {
      const fruitCount = products.filter(p => p.category === 'fruits').length;
      const responses = [
        `${fruitCount} fresh fruits ready!`,
        `Showing ${fruitCount} fruits now!`,
        `${fruitCount} fruit options available!`,
        `Here are ${fruitCount} fruits!`
      ];
      speak(getRandomItem(responses));
      setTimeout(() => navigate('/buyer/products?category=fruits'), 800);
    }
    
    // Conversational with variety
    else if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
      const responses = [
        "I can show products, check orders, find prices, and help you shop. What interests you?",
        "I handle products, orders, prices, and navigation. What do you need?",
        "Ask me about products, orders, prices, or tell me where to go!",
        "I'm here for products, orders, shopping help, and more. How can I assist?"
      ];
      speak(getRandomItem(responses));
    }
    else if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      speak(getRandomItem(greetings));
    }
    else if (lowerCommand.includes('thank')) {
      const responses = ["You're welcome!", "Happy to help!", "Anytime!", "My pleasure!", "Glad I could help!"];
      speak(getRandomItem(responses));
    }
    else if (lowerCommand.includes('time')) {
      const now = new Date();
      speak(`It's ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    }
    
    // Smart default with context
    else {
      const suggestions = [
        `Try "show products", "my orders", or ask about prices!`,
        `I can help with products, orders, or navigation. What do you need?`,
        `Ask me about products, check orders, or find prices!`,
        `Say "show products", "organic items", or "my orders"!`
      ];
      speak(getRandomItem(suggestions));
    }
  };

  return (
    <>
      {/* Floating Assistant Button - Siri-like */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 z-50 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 text-white rounded-full w-16 h-16 shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-110 flex items-center justify-center ${
          showActivationPulse ? 'animate-ping' : ''
        }`}
        style={{ 
          animation: isWakeWordListening ? 'pulse 2s infinite, glow 2s ease-in-out infinite' : 'none',
          boxShadow: isWakeWordListening ? '0 0 30px rgba(168, 85, 247, 0.6)' : ''
        }}
      >
        <div className="text-2xl">
          {isThinking ? '🧠' : isListening ? '👂' : isSpeaking ? '💬' : isWakeWordListening ? '🎙️' : '🤖'}
        </div>
      </button>

      {/* Proactive Suggestions Bubble */}
      {!isOpen && suggestions.length > 0 && !isListening && (
        <div className="fixed bottom-44 right-6 z-40 max-w-xs bg-white rounded-2xl shadow-2xl p-3 animate-slideUp border border-purple-200">
          <div className="text-xs font-semibold text-purple-600 mb-2 flex items-center">
            💡 Tomme suggests:
          </div>
          {suggestions.slice(0, 1).map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => processCommand(suggestion)}
              className="w-full text-left text-sm text-gray-700 hover:bg-purple-50 rounded-lg p-2 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Wake Word Indicator - Enhanced */}
      {isWakeWordListening && !isOpen && suggestions.length === 0 && (
        <div className="fixed bottom-44 right-6 z-40 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-xs shadow-lg animate-pulse">
          <span className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>Say "Hey Tomme" 🎤</span>
          </span>
        </div>
      )}

      {/* Advanced Assistant Panel - Siri-like Interface */}
      {isOpen && (
        <div className="fixed bottom-44 right-6 z-50 w-96 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden animate-slideUp border border-purple-200">
          {/* Header with Status */}
          <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-3xl animate-pulse-subtle">
                  {isThinking ? '🧠' : isListening ? '👂' : isSpeaking ? '💬' : '🤖'}
                </div>
                <div>
                  <h3 className="font-bold text-xl">Tomme</h3>
                  <p className="text-xs opacity-90">
                    {isThinking ? 'Thinking...' : 
                     isListening ? 'Listening...' : 
                     isSpeaking ? 'Speaking...' : 
                     continuousMode ? 'Conversation Mode' :
                     'AI Voice Assistant'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setContinuousMode(false);
                  stopListening();
                }}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Status Bar */}
            <div className="flex items-center justify-between text-xs opacity-75">
              <span className="flex items-center space-x-1">
                <span className={`w-2 h-2 rounded-full ${continuousMode ? 'bg-green-300 animate-pulse' : 'bg-white/50'}`}></span>
                <span>{continuousMode ? 'Continuous' : 'Single Command'}</span>
              </span>
              <span>{conversationHistory.filter(h => h.type === 'user').length} interactions</span>
            </div>
          </div>

          {/* Content Area - Scrollable */}
          <div className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar bg-gradient-to-b from-transparent to-purple-50/30">
            
            {/* Conversation History - Chat Style */}
            {conversationHistory.length > 0 && (
              <div className="mb-4 space-y-3">
                <p className="text-xs text-gray-500 text-center mb-2">Recent Conversation</p>
                {conversationHistory.slice(-4).map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.type === 'user' 
                        ? 'bg-blue-500 text-white rounded-tr-none' 
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Animated Avatar */}
            <div className="flex justify-center mb-4">
              <div className={`relative w-28 h-28 transition-all duration-300 ${
                isListening || isSpeaking || isThinking ? 'scale-110' : 'scale-100'
              }`}>
                <div className={`absolute inset-0 bg-gradient-to-br rounded-full flex items-center justify-center text-5xl transition-all duration-500 ${
                  isThinking ? 'from-yellow-400 to-orange-400 animate-pulse' :
                  isListening ? 'from-red-400 to-pink-400 animate-pulse' :
                  isSpeaking ? 'from-green-400 to-blue-400 animate-bounce-subtle' :
                  'from-purple-400 via-blue-400 to-indigo-400'
                }`}>
                  {isThinking ? '🧠' : isListening ? '👂' : isSpeaking ? '💬' : '🤖'}
                </div>
                
                {/* Advanced Waveform Visualization */}
                {showWaveform && (
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full animate-waveform ${
                          isListening ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{
                          height: '24px',
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: `${0.6 + (i * 0.05)}s`
                        }}
                      />
                    ))}
                  </div>
                )}
                
                {/* Thinking Animation */}
                {isThinking && (
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Live Transcript - Real-time */}
            {(interimTranscript || transcript) && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-3 border border-blue-200">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500 text-sm">👤</span>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">You said:</p>
                    <p className="text-sm text-gray-800 font-medium">
                      {transcript || interimTranscript}
                      {interimTranscript && <span className="animate-pulse">▋</span>}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Response */}
            {response && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-3 border border-purple-200">
                <div className="flex items-start space-x-2">
                  <span className="text-purple-500 text-sm">🤖</span>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Tomme:</p>
                    <p className="text-sm text-gray-800">{response}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Smart Suggestions */}
            {suggestions.length > 0 && !isListening && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2 flex items-center">
                  <span className="mr-1">💡</span>
                  Smart Suggestions:
                </p>
                <div className="space-y-2">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => processCommand(suggestion)}
                      className="w-full text-left text-sm bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 rounded-xl p-3 transition-all transform hover:scale-105 border border-purple-200"
                    >
                      <span className="text-purple-600 font-medium">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Action Cards */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-3 flex items-center">
                <span className="mr-1">⚡</span>
                Quick Actions:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => processCommand('show products')}
                  className="bg-gradient-to-br from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 rounded-xl p-3 transition-all transform hover:scale-105 text-left border border-green-200"
                >
                  <div className="text-2xl mb-1">🛒</div>
                  <div className="text-xs font-semibold text-gray-700">Products</div>
                </button>
                <button
                  onClick={() => processCommand('my orders')}
                  className="bg-gradient-to-br from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 rounded-xl p-3 transition-all transform hover:scale-105 text-left border border-blue-200"
                >
                  <div className="text-2xl mb-1">📦</div>
                  <div className="text-xs font-semibold text-gray-700">Orders</div>
                </button>
                <button
                  onClick={() => processCommand('what can you do')}
                  className="bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 rounded-xl p-3 transition-all transform hover:scale-105 text-left border border-purple-200"
                >
                  <div className="text-2xl mb-1">❓</div>
                  <div className="text-xs font-semibold text-gray-700">Help</div>
                </button>
                <button
                  onClick={() => processCommand('organic products')}
                  className="bg-gradient-to-br from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 rounded-xl p-3 transition-all transform hover:scale-105 text-left border border-yellow-200"
                >
                  <div className="text-2xl mb-1">🌱</div>
                  <div className="text-xs font-semibold text-gray-700">Organic</div>
                </button>
              </div>
            </div>
          </div>

          {/* Control Panel - Enhanced */}
          <div className="p-4 bg-gradient-to-r from-gray-50 to-purple-50 border-t border-gray-200">
            <div className="flex justify-center space-x-3 mb-3">
              {/* Main Mic Button - Siri-like */}
              <button
                onClick={isListening ? stopListening : startListening}
                className={`relative ${
                  isListening 
                    ? 'bg-gradient-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 animate-pulse' 
                    : 'bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 hover:from-purple-600 hover:via-blue-600 hover:to-indigo-600'
                } text-white rounded-full w-20 h-20 shadow-2xl transform transition-all hover:scale-110 flex items-center justify-center text-4xl`}
                style={{
                  boxShadow: isListening ? '0 0 40px rgba(239, 68, 68, 0.6)' : '0 10px 40px rgba(139, 92, 246, 0.4)'
                }}
              >
                {isListening ? '⏸️' : '🎙️'}
                {isListening && (
                  <span className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></span>
                )}
              </button>
              
              {/* Continuous Mode Toggle */}
              <button
                onClick={() => {
                  setContinuousMode(!continuousMode);
                  if (!continuousMode && !isListening) {
                    startListening();
                  }
                }}
                className={`${
                  continuousMode 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                    : 'bg-gradient-to-br from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
                } text-white rounded-full w-16 h-16 shadow-lg transform transition-all hover:scale-110 flex items-center justify-center text-2xl relative`}
                title={continuousMode ? 'Continuous Mode ON' : 'Continuous Mode OFF'}
              >
                🔄
                {continuousMode && (
                  <span className="absolute -top-1 -right-1 bg-green-400 rounded-full w-4 h-4 animate-ping"></span>
                )}
              </button>
              
              {/* Wake Word Toggle */}
              <button
                onClick={isWakeWordListening ? stopWakeWordDetection : startWakeWordDetection}
                className={`${
                  isWakeWordListening 
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600' 
                    : 'bg-gradient-to-br from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
                } text-white rounded-full w-16 h-16 shadow-lg transform transition-all hover:scale-110 flex items-center justify-center text-2xl relative`}
                title={isWakeWordListening ? 'Wake Word ON' : 'Wake Word OFF'}
              >
                👂
                {isWakeWordListening && (
                  <span className="absolute -top-1 -right-1 bg-blue-400 rounded-full w-4 h-4 animate-ping"></span>
                )}
              </button>
            </div>
            
            {/* Status Text */}
            <div className="text-center space-y-1">
              <p className="text-xs text-gray-600 font-medium">
                {isWakeWordListening ? '👂 Say "Hey Tomme" to activate' : 
                 continuousMode ? '🔄 Continuous conversation mode active' :
                 '👆 Tap microphone to speak'}
              </p>
              {conversationHistory.length > 0 && (
                <button
                  onClick={() => setConversationHistory([])}
                  className="text-xs text-purple-500 hover:text-purple-700 underline"
                >
                  Clear history
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced CSS Animations - Siri-level */}
      <style>{`
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 1;
          }
          50% { 
            transform: scale(1.05); 
            opacity: 0.9;
          }
        }

        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
          }
          50% { 
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.8);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes waveform {
          0%, 100% { 
            height: 6px;
            opacity: 0.6;
          }
          50% { 
            height: 28px;
            opacity: 1;
          }
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-5px) scale(1.02);
          }
        }

        @keyframes pulse-subtle {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-waveform {
          animation: waveform 0.6s ease-in-out infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #a855f7, #3b82f6);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #9333ea, #2563eb);
        }

        /* Glassmorphism Effect */
        .glass-effect {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>
    </>
  );
};

export default VoiceAssistant;
