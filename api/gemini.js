import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set');
      return res.status(500).json({
        error: 'API-nyckel saknas. Kontrollera serverinställningarna.'
      });
    }

    // Get prompt from request body
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt krävs' });
    }

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);

    // Use Gemini 2.0 Flash Experimental model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp'
    });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Return the generated text
    return res.status(200).json({
      success: true,
      text: text
    });

  } catch (error) {
    console.error('Error calling Gemini API:', error);

    // Return user-friendly error message
    return res.status(500).json({
      error: 'Kunde inte få svar från AI. Försök igen senare.',
      details: error.message
    });
  }
}
