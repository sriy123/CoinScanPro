import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import { coinAnalysisSchema } from "@shared/schema";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Coin analysis endpoint
  app.post('/api/analyze-coin', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      // Convert buffer to base64
      const base64Image = req.file.buffer.toString('base64');

      const systemPrompt = `You are an expert numismatist (coin expert) who can identify coins from images. 
Analyze the coin image and provide detailed information in JSON format with these exact fields:
- coinType: the specific name/type of the coin (e.g., "Quarter Dollar", "1 Rupee Coin", "50 Euro Cent")
- country: the country of origin (e.g., "United States", "India", "European Union")
- countryFlag: the emoji flag for the country (e.g., "🇺🇸", "🇮🇳", "🇪🇺")
- denomination: the face value with currency unit (e.g., "25 Cents", "1 Rupee", "50 Cents")
- year: the year the coin was minted (if visible, otherwise omit)
- confidence: your confidence level in the identification (0-100)
- material: the material composition if identifiable (e.g., "Copper-Nickel", "Stainless Steel")
- value: the numeric face value in the original currency as a decimal number (e.g., 0.25 for a quarter, 1 for 1 rupee)
- currency: the ISO currency code (e.g., "USD", "INR", "EUR")

Be as accurate as possible. If you cannot identify the coin clearly, provide your best guess with a lower confidence score.`;

      const contents = [
        {
          inlineData: {
            data: base64Image,
            mimeType: req.file.mimetype,
          },
        },
        "Please identify this coin and provide the information in JSON format.",
      ];

      // Call Gemini Vision API
      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              coinType: { type: "string" },
              country: { type: "string" },
              countryFlag: { type: "string" },
              denomination: { type: "string" },
              year: { type: ["string", "number"] },
              confidence: { type: "number" },
              material: { type: "string" },
              value: { type: "number" },
              currency: { type: "string" },
            },
            required: ["coinType", "country", "countryFlag", "denomination", "value", "currency"],
          },
        },
        contents: contents,
      });

      const content = response.text;
      if (!content) {
        throw new Error('No response from Gemini');
      }
      const parsedResult = JSON.parse(content);

      // Validate the response against our schema
      const validatedResult = coinAnalysisSchema.parse(parsedResult);

      res.json(validatedResult);
    } catch (error) {
      console.error('Error analyzing coin:', error);
      res.status(500).json({ 
        error: 'Failed to analyze coin',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
