// Gemini API Configuration
// Get your API key from: https://aistudio.google.com/app/apikey

export const GEMINI_API_KEY = 'AIzaSyB8al9vo7X7kCho6V3Uh1JEQ5TLKBlwiKo';

export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const GEMINI_VISION_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';

export const callGeminiAPI = async (prompt) => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    return null;
  }
};

// Analyze product image quality using Gemini Vision
export const analyzeProductImage = async (base64Image) => {
  try {
    // Remove data URL prefix if present
    const imageData = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');
    
    const response = await fetch(`${GEMINI_VISION_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Analyze this agricultural product image and provide a quality assessment. Return ONLY a JSON object with this exact structure:
{
  "freshness": "Excellent|Good|Fair|Poor",
  "appearance": "Excellent|Good|Fair|Poor",
  "qualityScore": 85,
  "qualityIndicators": ["Fresh", "Organic-looking", "Well-formed"],
  "defects": ["Minor blemishes"],
  "recommendation": "Brief recommendation for buyers"
}

Focus on:
- Freshness and color vibrancy
- Shape and form
- Any visible defects or damage
- Overall appeal to buyers
- Estimated shelf life indicators

Be honest but fair in assessment. Give a quality score out of 100.`
            },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageData
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 512,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini Vision API error: ${response.status}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return null;
  } catch (error) {
    console.error('Gemini Vision API Error:', error);
    return null;
  }
};
