import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  } else {
    console.warn("GEMINI_API_KEY is missing. Using mock data fallback.");
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenAI", e);
}

// Ensure the helper converts a generic base64 to the format Gemini expects or handles URLs
function base64ToPart(base64Image: string) {
  // Typical data URL structure: data:image/jpeg;base64,...
  const matches = base64Image.match(/^data:(image\/[a-z]+);base64,(.+)$/i);
  if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 image data');
  }
  return {
      inlineData: {
          data: matches[2],
          mimeType: matches[1]
      }
  };
}

export async function generateGeminiRecommendation(textQuery?: string, imageBase64?: string, language: string = 'id') {
  // If no API key, return a highly realistic mock payload
  if (!ai) {
    if (textQuery?.toLowerCase().includes('healthy') || textQuery?.toLowerCase().includes('green')) {
      return {
        disease: "Healthy Vegetative Stage",
        confidence: 96,
        recommendation: "Your plants show optimal growth. Continue standard fertilization routine according to schedule. Ensure field water circulation is well maintained.",
        harvestImpact: "Potential maximum yield (100%). Grain yield projected to be optimal because vegetative condition is excellent.",
        isHealthy: true,
        generatedImageUrl: "https://images.unsplash.com/photo-1595861176508-36c5b0b2e3e5?w=400&q=80"
      };
    }
    
    // Simulate delay
    await new Promise(res => setTimeout(res, 2000));
    
    // Default mock response (Disease/Issue detected)
    return {
      disease: "Tungro Virus / Stunted Growth",
      confidence: 88,
      recommendation: "Remove infected plants immediately to prevent spreading. Apply designated pesticide for green leafhoppers which act as vectors. Do not apply high nitrogen fertilizers right now.",
      harvestImpact: "If left untreated, potential yield drop of 20% - 40% due to stunted growth and empty grains at harvest.",
      isHealthy: false,
      generatedImageUrl: "https://images.unsplash.com/photo-1588612140669-e0c90c7447ae?w=400&q=80"
    };
  }

  const languagePrompt = language === 'id' ? 'Provide the response in Indonesian Language.' : language === 'zh' ? 'Provide the response in Chinese Language.' : 'Provide the response in English Language.';

  const prompt = `
    You are AgriAI (by JoSi), an agricultural deep learning master specializing in complete rice farming and yield prediction.
    Analyze the provided input (text describing symptoms, or image) from the farmer.
    Evaluate the overall plant health, potential yield impact, and stage of growth. Do NOT just focus on leaves, think about the entire harvest.
    
    ${languagePrompt}

    If healthy, report it as healthy.
    If there's an issue (pests, disease, nutritional deficiency), identify it specifically.

    Provide the result ONLY IN JSON FORMAT exactly matching this structure (valid JSON without markdown block formatting \`\`\`json):
    {
      "disease": "string (Short name of the status or condition, e.g. 'Healthy Vegetative Stage', 'Nitrogen Deficiency')",
      "confidence": number (1-100 representing AI certainty),
      "recommendation": "string (Detailed actionable steps for the farmer to improve yield or fix the issue. Max 3 sentences.)",
      "harvestImpact": "string (How this condition affects the final harvest/yield. Mention potential loss or gain in Tons/Hectare if applicable.)",
      "isHealthy": boolean
    }

    ${textQuery ? `Farmer Description / Symptoms: "${textQuery}"` : "The farmer only provided an image without a text description."}
  `;

  try {
    const contents: any[] = [{ text: prompt }];
    
    if (imageBase64) {
      contents.push(base64ToPart(imageBase64));
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        responseMimeType: "application/json",
      }
    });

    const textResult = response.text;
    if (!textResult) throw new Error("Empty response from AI");
    
    try {
      const parsedObject = JSON.parse(textResult);
      let generatedImageUrl = undefined;
      
      // Generate image if they only provided text
      if (!imageBase64) {
        try {
          const prompt = `Realistic photo of a rice farm field showing ${parsedObject.disease || textQuery}. Photorealistic, clear, agricultural perspective, outdoor lighting, high resolution.`;
          generatedImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&nologo=true`;
        } catch (imgError) {
          console.error("Failed to set generated image URL:", imgError);
        }
      }

      return {
        disease: parsedObject.disease || "Undefined",
        confidence: parseInt(parsedObject.confidence) || 0,
        recommendation: parsedObject.recommendation || "Consult with local agricultural experts immediately.",
        harvestImpact: parsedObject.harvestImpact || "Impact cannot be fully determined yet.",
        isHealthy: parsedObject.isHealthy === true,
        generatedImageUrl
      };
    } catch (parseError) {
      console.error("Failed to parse JSON from Gemini:", textResult);
      throw new Error("Invalid AI response format.");
    }

  } catch (error: any) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to reach AI Model. Please try again.');
  }
}
