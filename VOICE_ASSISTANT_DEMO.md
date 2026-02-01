# 🎙️ Voice Assistant Demo Guide

## 🚀 Your app is now running at: http://localhost:3000

---

## 🎯 Quick Test Guide

### Step 1: Initial Setup
1. Open http://localhost:3000 in Chrome or Edge (best support)
2. **IMPORTANT**: Allow microphone permissions when prompted
3. Look for the purple robot button (🤖) in the bottom-right corner

---

## 🧪 Testing Scenarios

### Test 1: Wake Word Detection (Hands-Free) 👂
```
1. Click the "ear" button (👂) to enable wake word detection
2. Notice the purple glow and "Say Hey Tomme" indicator
3. Say: "Hey Tomme"
4. Watch the assistant activate automatically!
5. Say: "Show me products"
```

**Expected Result**: 
- Assistant opens automatically on wake word
- Greeting message plays
- Navigates to products page

---

### Test 2: Continuous Conversation Mode 🔄
```
1. Open the assistant (click robot button)
2. Click the middle button (🔄) to enable continuous mode
3. Say: "What products are available?"
4. Wait for response
5. Then say: "Show me organic ones"
6. Then say: "What's the price?"
```

**Expected Result**:
- Multiple exchanges without re-activation
- Context is maintained across questions
- Natural follow-up understanding

---

### Test 3: Real-Time Transcription ⚡
```
1. Open assistant
2. Click microphone (🎙️)
3. Speak slowly: "I want to buy some vegetables"
4. Watch the text appear in real-time as you speak
5. See the typing cursor (▋) animation
```

**Expected Result**:
- Words appear as you speak (interim results)
- Final transcript shows complete sentence
- Smooth, Siri-like experience

---

### Test 4: Smart Product Queries 🛒
```
Try these advanced commands:

1. "What's available?"
   → Should list products with details

2. "How much for tomatoes?"
   → Should give specific price and availability

3. "Show me organic products"
   → Should filter and navigate to organic items

4. "What's cheap and good?"
   → Should analyze and recommend best value

5. "Something like onions"
   → Should show related products
```

**Expected Result**:
- Detailed, contextual responses
- Price information included
- Smart recommendations
- Appropriate navigation

---

### Test 5: Proactive Suggestions 💡
```
1. Keep the assistant closed
2. Wait 30 seconds to 1 minute
3. Look for suggestion bubbles appearing above robot
4. These change based on:
   - Time of day
   - Current page
   - Cart contents
   - Order status
```

**Expected Result**:
- Contextual suggestions appear
- Can click to execute suggestion
- Changes based on user behavior

---

### Test 6: Conversation History 💬
```
1. Open assistant
2. Have multiple exchanges
3. Scroll up in the conversation area
4. See chat-style history with timestamps
5. Notice user messages (blue) vs assistant (gray)
```

**Expected Result**:
- Last 4 exchanges visible
- Chat-style bubbles
- Timestamps on each message
- Clear distinction between user/assistant

---

### Test 7: Emotional Intelligence 🎭
```
Try these with different tones:

1. Say urgently: "I need vegetables NOW!"
   → Should respond faster, urgently

2. Say happily: "This is amazing!"
   → Should match enthusiasm

3. Say calmly: "There's a problem with my order"
   → Should respond empathetically
```

**Expected Result**:
- Response tone matches your emotion
- Speech rate adjusts
- Appropriate empathy level

---

### Test 8: Quick Action Cards ⚡
```
1. Open assistant
2. Scroll down to "Quick Actions" section
3. Try clicking:
   - 🛒 Products
   - 📦 Orders
   - ❓ Help
   - 🌱 Organic
```

**Expected Result**:
- One-click navigation
- Appropriate voice response
- Smooth page transition

---

### Test 9: Multi-Step Commands 🎯
```
Try these complex commands:

1. "Add tomatoes to cart and checkout"
   → Should add item AND navigate to checkout

2. "Show me organic vegetables under 50 rupees"
   → Should apply multiple filters

3. "Which farmer has the cheapest tomatoes?"
   → Should analyze and recommend
```

**Expected Result**:
- Understands multi-part requests
- Executes all steps
- Smart filtering and analysis

---

### Test 10: Context & Memory 🧠
```
1. Say: "Show me products"
2. Wait for response
3. Say: "Just vegetables"
4. Wait for response
5. Say: "The organic ones"
6. Wait for response
7. Say: "What was the first thing I asked?"
```

**Expected Result**:
- Each follow-up understood in context
- References to "that", "it", "them" work
- Remembers earlier conversation
- Can recall previous requests

---

## 🎨 Visual Features to Notice

### Animations
- ✨ **Pulsing glow** around button when wake word is active
- 🌊 **Waveform bars** when listening (7 animated bars)
- 🧠 **Bouncing dots** when thinking/processing
- 💫 **Smooth transitions** on all state changes
- 🎭 **Color changes** based on state (red=listening, green=speaking, yellow=thinking)

### States
- **Default**: Purple/blue gradient robot
- **Listening**: Red/pink with waveform
- **Speaking**: Green/blue with bounce
- **Thinking**: Yellow/orange with dots
- **Wake Word Active**: Glowing purple aura

---

## 🗣️ Voice Commands Cheat Sheet

### Basic Navigation
- "Open dashboard"
- "Show products"
- "My orders"
- "Track my order"
- "Show cart"
- "Open profile"

### Product Queries
- "What's available?"
- "Show me vegetables"
- "Organic products"
- "What's cheap?"
- "Best quality items"
- "Fresh arrivals"

### Information
- "How much for [product]?"
- "Is [product] available?"
- "Tell me about [product]"
- "What's in stock?"
- "Any deals?"

### Conversational
- "I need vegetables for dinner"
- "Something healthy"
- "What do you recommend?"
- "That sounds good"
- "Show me more like that"

### Meta Commands
- "Help"
- "What can you do?"
- "Hello" / "Hi"
- "Thank you"
- "What time is it?"

---

## 🐛 Troubleshooting

### Microphone Not Working
1. Check browser permissions (chrome://settings/content/microphone)
2. Try a different browser (Chrome/Edge recommended)
3. Test microphone in other apps first
4. Reload the page and allow permissions

### Wake Word Not Responding
1. Make sure wake word button (👂) is enabled (should glow blue)
2. Speak clearly: "Hey Tomme" or "Tomme"
3. Check microphone sensitivity in system settings
4. Try in a quiet environment

### No Voice Response
1. Check system volume
2. Ensure speakers/headphones connected
3. Try text-to-speech test: "What time is it?"
4. Check browser audio permissions

### Assistant Not Understanding
1. Speak clearly and at normal pace
2. Try rephrasing the command
3. Use simpler, more direct language
4. Check that you're using English (or selected language)

---

## 📊 Performance Tips

### For Best Experience:
1. ✅ Use Chrome or Edge browser
2. ✅ Enable microphone permissions immediately
3. ✅ Test in quiet environment
4. ✅ Speak naturally, not robotic
5. ✅ Use continuous mode for conversations
6. ✅ Enable wake word for hands-free use

### Advanced Users:
1. Try multi-step commands
2. Use conversational follow-ups
3. Reference previous items ("that", "it")
4. Ask for comparisons and recommendations
5. Test emotional responses
6. Explore proactive suggestions

---

## 🎉 Cool Things to Try

1. **Say "Hey Tomme" without opening the assistant** - It activates automatically!

2. **Have a full shopping conversation** - "Show products" → "Just vegetables" → "Organic ones" → "Add tomatoes"

3. **Watch real-time transcription** - See your words appear as you speak

4. **Test emotion detection** - Say something urgently, then calmly

5. **Let it suggest things** - Wait and watch for proactive suggestions

6. **Try vague commands** - "I need stuff for curry" → It understands!

7. **Ask complex questions** - "Which farmer has the cheapest organic tomatoes nearby?"

8. **Use follow-ups** - "Show products" → "Which are organic?" → "How much?"

9. **Test memory** - Ask about something from 3 exchanges ago

10. **Voice shopping** - Complete a full order using only voice!

---

## 📝 Notes

- The AI responses are powered by Google's Gemini API
- All conversation history is stored locally in your browser
- Preferences are learned over time and saved
- Wake word detection uses Web Speech API
- Works best in Chrome/Edge browsers
- Requires internet for AI features (has offline fallback)

---

## 🎯 Success Indicators

You'll know it's working perfectly when:
- ✅ Wake word activates hands-free
- ✅ Real-time transcription shows your words
- ✅ Responses are contextual and intelligent
- ✅ Animations are smooth and beautiful
- ✅ Follow-up questions work naturally
- ✅ Proactive suggestions appear
- ✅ Emotional responses feel appropriate
- ✅ Multi-step commands execute fully

---

## 🚀 Ready to Test!

Your Siri-level voice assistant is ready. Start by:
1. Opening http://localhost:3000
2. Allowing microphone access
3. Saying "Hey Tomme"
4. Having a natural conversation!

**Enjoy your advanced AI assistant! 🎙️✨**
