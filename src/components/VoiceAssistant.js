import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { callGeminiAPI } from '../config/gemini';

// 🎨 Multi-language support
const LANGUAGES = {
  en: { name: 'English', code: 'en-US', voice: 'en-US' },
  hi: { name: 'हिंदी', code: 'hi-IN', voice: 'hi-IN' },
  te: { name: 'తెలుగు', code: 'te-IN', voice: 'te-IN' },
  ta: { name: 'தமிழ்', code: 'ta-IN', voice: 'ta-IN' },
  kn: { name: 'ಕನ್ನಡ', code: 'kn-IN', voice: 'kn-IN' }
};

const WAKE_WORD = 'hey tomme';
const MAX_CONTEXT_MESSAGES = 6;

const VoiceAssistant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 🎤 Voice States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('idle'); // idle, listening, processing, speaking
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isWakeWordMode, setIsWakeWordMode] = useState(true);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [error, setError] = useState('');
  
  // 📱 Refs
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const timeoutRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const silenceTimeoutRef = useRef(null);

  // 🧠 Initialize Speech Recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = LANGUAGES[currentLanguage].code;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onstart = () => {
      console.log('🎤 Recognition started');
      setIsListening(true);
      setError('');
    };

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const fullTranscript = (finalTranscript || interimTranscript).toLowerCase().trim();
      setTranscript(fullTranscript);

      // Reset silence timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }

      // Check for wake word
      if (isWakeWordMode && fullTranscript.includes(WAKE_WORD)) {
        console.log('🔔 Wake word detected!');
        speak('Yes, how can I help you?');
        setIsWakeWordMode(false);
        setTranscript('');
        return;
      }

      // Process command after wake word
      if (!isWakeWordMode && finalTranscript) {
        console.log('📝 Final transcript:', finalTranscript);
        processCommand(finalTranscript);
        setTranscript('');
      }

      // Set silence timeout for continuous listening
      silenceTimeoutRef.current = setTimeout(() => {
        if (!isWakeWordMode) {
          console.log('⏱️ Silence detected, returning to wake word mode');
          setIsWakeWordMode(true);
        }
      }, 3000);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('❌ Recognition error:', event.error);
      if (event.error === 'no-speech') {
        console.log('No speech detected, continuing...');
      } else if (event.error === 'not-allowed') {
        setError('Microphone permission denied');
        setIsListening(false);
      } else {
        setError(`Error: ${event.error}`);
      }
    };

    recognitionRef.current.onend = () => {
      console.log('🛑 Recognition ended');
      setIsListening(false);
      
      // Auto-restart after 500ms
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      restartTimeoutRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.log('Recognition already started or stopped by user');
          }
        }
      }, 500);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    };
  }, [currentLanguage, isWakeWordMode]);

  // 🎙️ Start/Stop Listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setStatus('idle');
    } else {
      try {
        recognitionRef.current?.start();
        setStatus('listening');
        setIsWakeWordMode(true);
      } catch (err) {
        console.error('Error starting recognition:', err);
      }
    }
  }, [isListening]);

  // 🗣️ Text-to-Speech
  const speak = useCallback((text) => {
    if (!text) return;

    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANGUAGES[currentLanguage].voice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setStatus('speaking');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setStatus(isListening ? 'listening' : 'idle');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    setResponse(text);
    synthRef.current.speak(utterance);
  }, [currentLanguage, isListening]);

  // 🧠 Process Voice Command with AI
  const processCommand = async (command) => {
    if (!command || isProcessing) return;

    setIsProcessing(true);
    setStatus('processing');

    try {
      // Add to conversation history
      const newHistory = [
        ...conversationHistory,
        { role: 'user', content: command }
      ].slice(-MAX_CONTEXT_MESSAGES);

      // Detect intent and route
      const intent = detectIntent(command);
      
      if (intent.action) {
        // Execute action
        executeAction(intent);
        const actionResponse = intent.response || 'Done!';
        speak(actionResponse);
        
        newHistory.push({ role: 'assistant', content: actionResponse });
        setConversationHistory(newHistory);
      } else {
        // Use AI for natural conversation
        const currentPage = location.pathname;
        const userType = localStorage.getItem('userType') || 'buyer';
        
        const contextPrompt = `You are Tomme, a helpful voice assistant for FarmBridge app.
User type: ${userType}
Current page: ${currentPage}
Conversation history: ${JSON.stringify(newHistory)}

User said: "${command}"

Respond naturally in 1-2 short sentences. Be helpful and friendly.`;

        const aiResponse = await callGeminiAPI(contextPrompt);
        speak(aiResponse);
        
        newHistory.push({ role: 'assistant', content: aiResponse });
        setConversationHistory(newHistory);
      }
    } catch (err) {
      console.error('Error processing command:', err);
      const fallback = 'Sorry, I had trouble understanding that. Could you try again?';
      speak(fallback);
    } finally {
      setIsProcessing(false);
      setStatus(isListening ? 'listening' : 'idle');
    }
  };

  // 🎯 Detect Intent from Command
  const detectIntent = (command) => {
    const cmd = command.toLowerCase();

    // Language switching
    if (cmd.includes('switch to hindi') || cmd.includes('hindi')) {
      return { action: 'changeLanguage', lang: 'hi', response: 'Switching to Hindi' };
    }
    if (cmd.includes('switch to telugu') || cmd.includes('telugu')) {
      return { action: 'changeLanguage', lang: 'te', response: 'Switching to Telugu' };
    }
    if (cmd.includes('switch to tamil') || cmd.includes('tamil')) {
      return { action: 'changeLanguage', lang: 'ta', response: 'Switching to Tamil' };
    }
    if (cmd.includes('switch to kannada') || cmd.includes('kannada')) {
      return { action: 'changeLanguage', lang: 'kn', response: 'Switching to Kannada' };
    }
    if (cmd.includes('switch to english') || cmd.includes('english')) {
      return { action: 'changeLanguage', lang: 'en', response: 'Switching to English' };
    }

    // Navigation - Buyer
    if (cmd.includes('show') && (cmd.includes('farmer') || cmd.includes('sellers'))) {
      return { action: 'navigate', route: '/buyer/farmers', response: 'Showing nearby farmers' };
    }
    if (cmd.includes('search') || cmd.includes('find product')) {
      return { action: 'navigate', route: '/buyer/products', response: 'Opening products page' };
    }
    if (cmd.includes('cart') || cmd.includes('my cart')) {
      return { action: 'navigate', route: '/buyer/cart', response: 'Opening your cart' };
    }
    if (cmd.includes('track') && cmd.includes('order')) {
      return { action: 'navigate', route: '/buyer/orders', response: 'Opening order tracking' };
    }
    if (cmd.includes('my order') || cmd.includes('order history')) {
      return { action: 'navigate', route: '/buyer/orders', response: 'Showing your orders' };
    }
    if (cmd.includes('profile') || cmd.includes('my profile')) {
      const userType = localStorage.getItem('userType') || 'buyer';
      return { action: 'navigate', route: `/${userType}/profile`, response: 'Opening your profile' };
    }

    // Navigation - Farmer
    if (cmd.includes('add') && cmd.includes('product')) {
      return { action: 'navigate', route: '/farmer/products', response: 'Opening product management' };
    }
    if (cmd.includes('my product') || cmd.includes('manage product')) {
      return { action: 'navigate', route: '/farmer/products', response: 'Opening your products' };
    }
    if (cmd.includes('check') && (cmd.includes('sales') || cmd.includes('earning'))) {
      return { action: 'navigate', route: '/farmer/dashboard', response: 'Opening sales dashboard' };
    }
    if (cmd.includes('pending order') || cmd.includes('new order')) {
      return { action: 'navigate', route: '/farmer/orders', response: 'Showing pending orders' };
    }
    if (cmd.includes('dashboard') || cmd.includes('home')) {
      const userType = localStorage.getItem('userType') || 'buyer';
      return { action: 'navigate', route: `/${userType}/dashboard`, response: 'Going to dashboard' };
    }

    // Cart actions
    if (cmd.includes('add to cart')) {
      return { action: 'addToCart', response: 'I can help you add items. Which product would you like?' };
    }
    if (cmd.includes('place order') || cmd.includes('checkout')) {
      return { action: 'navigate', route: '/buyer/checkout', response: 'Proceeding to checkout' };
    }

    // Help
    if (cmd.includes('help') || cmd.includes('what can you do')) {
      const userType = localStorage.getItem('userType') || 'buyer';
      if (userType === 'farmer') {
        return { 
          action: 'help', 
          response: 'I can help you manage products, check sales, view orders, and navigate the app. Just ask!' 
        };
      } else {
        return { 
          action: 'help', 
          response: 'I can help you find farmers, search products, manage your cart, and track orders. Just ask!' 
        };
      }
    }

    return { action: null };
  };

  // ⚡ Execute Actions
  const executeAction = (intent) => {
    switch (intent.action) {
      case 'navigate':
        navigate(intent.route);
        break;
      case 'changeLanguage':
        setCurrentLanguage(intent.lang);
        if (recognitionRef.current) {
          recognitionRef.current.lang = LANGUAGES[intent.lang].code;
        }
        break;
      case 'addToCart':
      case 'help':
        // Response already provided
        break;
      default:
        break;
    }
  };

  // 🎨 Status Badge
  const getStatusBadge = () => {
    switch (status) {
      case 'listening':
        return { text: isWakeWordMode ? '👂 Say "Hey Tomme"' : '🎤 Listening...', color: '#10b981' };
      case 'processing':
        return { text: '🧠 Processing...', color: '#f59e0b' };
      case 'speaking':
        return { text: '🗣️ Speaking...', color: '#3b82f6' };
      default:
        return { text: '💤 Idle', color: '#6b7280' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div style={styles.container}>
      {/* Floating Voice Button */}
      <button
        onClick={toggleListening}
        style={{
          ...styles.floatingButton,
          backgroundColor: isListening ? '#ef4444' : '#10b981',
          transform: isListening ? 'scale(1.1)' : 'scale(1)',
          boxShadow: isListening 
            ? '0 0 30px rgba(16, 185, 129, 0.6)' 
            : '0 4px 20px rgba(0, 0, 0, 0.2)'
        }}
      >
        {isListening ? (
          <div style={styles.waveAnimation}>
            <div style={styles.wave}></div>
            <div style={styles.wave}></div>
            <div style={styles.wave}></div>
          </div>
        ) : (
          <span style={styles.micIcon}>🎤</span>
        )}
      </button>

      {/* Status Panel */}
      {(isListening || isSpeaking || isProcessing) && (
        <div style={styles.statusPanel}>
          <div style={{ ...styles.statusBadge, backgroundColor: statusBadge.color }}>
            {statusBadge.text}
          </div>
          
          {/* Language Selector */}
          <select
            value={currentLanguage}
            onChange={(e) => {
              setCurrentLanguage(e.target.value);
              if (recognitionRef.current) {
                recognitionRef.current.lang = LANGUAGES[e.target.value].code;
              }
            }}
            style={styles.languageSelect}
          >
            {Object.entries(LANGUAGES).map(([key, lang]) => (
              <option key={key} value={key}>{lang.name}</option>
            ))}
          </select>

          {/* Transcript */}
          {transcript && (
            <div style={styles.transcript}>
              <strong>You:</strong> {transcript}
            </div>
          )}

          {/* Response */}
          {response && (
            <div style={styles.response}>
              <strong>Tomme:</strong> {response}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={styles.error}>
              ⚠️ {error}
            </div>
          )}
        </div>
      )}

      {/* Quick Help */}
      {!isListening && (
        <div style={styles.helpButton} onClick={toggleListening}>
          <span style={{ fontSize: '16px' }}>💬</span>
          <span style={{ fontSize: '11px', marginTop: '2px' }}>Tomme</span>
        </div>
      )}
    </div>
  );
};

// 🎨 Styles
const styles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 9999,
  },
  floatingButton: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  micIcon: {
    fontSize: '32px',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
  },
  waveAnimation: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wave: {
    width: '6px',
    height: '30px',
    backgroundColor: 'white',
    borderRadius: '3px',
    animation: 'wave 0.6s ease-in-out infinite',
    animationDelay: 'calc(var(--i) * 0.1s)',
  },
  statusPanel: {
    position: 'absolute',
    bottom: '90px',
    right: '0',
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    minWidth: '300px',
    maxWidth: '400px',
    animation: 'slideUp 0.3s ease',
  },
  statusBadge: {
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px',
    textAlign: 'center',
  },
  languageSelect: {
    width: '100%',
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    marginBottom: '12px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  transcript: {
    backgroundColor: '#f3f4f6',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '8px',
    wordWrap: 'break-word',
  },
  response: {
    backgroundColor: '#dbeafe',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    wordWrap: 'break-word',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '13px',
    marginTop: '8px',
  },
  helpButton: {
    position: 'absolute',
    bottom: '90px',
    right: '0',
    backgroundColor: '#10b981',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.2s ease',
  },
};

// Add keyframe animations
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  try {
    styleSheet.insertRule(`
      @keyframes wave {
        0%, 100% { height: 20px; }
        50% { height: 40px; }
      }
    `, styleSheet.cssRules.length);
    
    styleSheet.insertRule(`
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
    `, styleSheet.cssRules.length);
  } catch (e) {
    console.log('Animation styles already exist');
  }
}

export default VoiceAssistant;
