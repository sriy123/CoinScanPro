import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import OpenAI from "openai";
import { coinAnalysisSchema } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

      // Call OpenAI Vision API
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: `You are an expert numismatist (coin expert) who can identify coins from images. 
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

Be as accurate as possible. If you cannot identify the coin clearly, provide your best guess with a lower confidence score.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please identify this coin and provide the information in JSON format."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${req.file.mimetype};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2048,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from OpenAI');
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
