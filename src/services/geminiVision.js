// Gemini Vision API Configuration
const GEMINI_VISION_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyBJFDjTwVqoSLQ-Sz57-i74MILhEPVy3Kw';
const GEMINI_VISION_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Analyze product image quality using Gemini Vision API
 * @param {File|string} imageInput - Image file or base64 string
 * @returns {Promise<Object>} Analysis results with quality score and details
 */
export const analyzeProductQuality = async (imageInput) => {
  try {
    let base64Image = '';
    let mimeType = 'image/jpeg';

    // Convert File to base64 if needed
    if (imageInput instanceof File) {
      base64Image = await fileToBase64(imageInput);
      mimeType = imageInput.type;
      // Remove data:image/xxx;base64, prefix if present
      base64Image = base64Image.split(',')[1] || base64Image;
    } else if (typeof imageInput === 'string') {
      // Already base64 or data URL
      if (imageInput.startsWith('data:')) {
        const parts = imageInput.split(',');
        base64Image = parts[1];
        mimeType = parts[0].match(/:(.*?);/)[1];
      } else {
        base64Image = imageInput;
      }
    }

    const requestBody = {
      contents: [{
        parts: [
          {
            text: `Analyze this agricultural product image and provide a detailed quality assessment. 

Please evaluate:
1. Freshness (1-10 scale)
2. Visual appearance and color
3. Any visible defects or damage
4. Ripeness level (if applicable)
5. Overall quality score (1-10)
6. Brief quality description in 1-2 sentences

Respond in JSON format:
{
  "freshness": <number 1-10>,
  "appearance": "<brief description>",
  "defects": "<none or description>",
  "ripeness": "<description>",
  "qualityScore": <number 1-10>,
  "qualityBadge": "<Excellent|Good|Average|Poor>",
  "description": "<1-2 sentence summary>"
}`
          },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Image
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 500
      }
    };

    const response = await fetch(`${GEMINI_VISION_API_URL}?key=${GEMINI_VISION_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini Vision API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No analysis results from Gemini Vision');
    }

    const resultText = data.candidates[0].content.parts[0].text;
    
    // Try to extract JSON from response
    let analysisResult;
    try {
      // Remove markdown code blocks if present
      const jsonText = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisResult = JSON.parse(jsonText);
    } catch (parseError) {
      // Fallback: Create structured result from text
      analysisResult = {
        freshness: 7,
        appearance: "Good quality product",
        defects: "None visible",
        ripeness: "Appropriate",
        qualityScore: 7.5,
        qualityBadge: "Good",
        description: resultText.substring(0, 200)
      };
    }

    return {
      success: true,
      analysis: analysisResult,
      rawResponse: resultText
    };

  } catch (error) {
    console.error('Product quality analysis error:', error);
    return {
      success: false,
      error: error.message,
      analysis: {
        qualityScore: 0,
        qualityBadge: "Unknown",
        description: "Failed to analyze product quality"
      }
    };
  }
};

/**
 * Convert File to base64 string
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Get quality badge color based on score
 */
export const getQualityBadgeColor = (badge) => {
  const colors = {
    'Excellent': '#10b981', // green
    'Good': '#3b82f6',      // blue
    'Average': '#f59e0b',   // yellow
    'Poor': '#ef4444'       // red
  };
  return colors[badge] || '#6b7280'; // gray default
};

/**
 * Get quality score color
 */
export const getQualityScoreColor = (score) => {
  if (score >= 8) return '#10b981'; // green
  if (score >= 6) return '#3b82f6'; // blue
  if (score >= 4) return '#f59e0b'; // yellow
  return '#ef4444'; // red
};
