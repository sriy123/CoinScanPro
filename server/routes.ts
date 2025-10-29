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

      const systemPrompt = `You are an expert numismatist (coin expert) who can identify coins from images and estimate their collector value, even when coins are dirty, worn, corroded, or in poor physical condition.

FIRST: Determine if the image actually shows a coin or currency. If it's clearly NOT a coin (e.g., an animal, person, food, object, etc.), set isCoin to false and describe what it actually is in the actualObject field.

If it IS a coin, set isCoin to true and proceed with full analysis.

IMPORTANT: Look past dirt, tarnish, corrosion, and wear to identify the underlying coin. Focus on:
- Visible text, numbers, or letters (even if faint or partially obscured)
- Overall size and shape
- Any visible design elements, portraits, or symbols
- Edge type (if visible)
- Color of the base metal beneath any tarnish

Even dirty or damaged coins can be valuable if they are old or rare. Do not dismiss a coin's value just because it appears worn.

Analyze the image and provide detailed information in JSON format with these exact fields:

REQUIRED FIELDS (always include):
- isCoin: boolean - true if it's a coin/currency, false if it's something else
- actualObject: string - if isCoin is false, describe what the object actually is (e.g., "a donkey", "a car", "a person", "food")

IF IT IS A COIN (isCoin = true), also include:
- coinType: the specific name/type of the coin (e.g., "Quarter Dollar", "1 Rupee Coin", "50 Euro Cent")
- country: the country of origin (e.g., "United States", "India", "European Union")
- countryFlag: the emoji flag for the country (e.g., "🇺🇸", "🇮🇳", "🇪🇺")
- denomination: the face value with currency unit (e.g., "25 Cents", "1 Rupee", "50 Cents")
- year: the year the coin was minted (if visible, otherwise estimate based on design features)
- confidence: your confidence level in the identification (0-100)
- material: the material composition if identifiable (e.g., "Copper-Nickel", "Stainless Steel", "Silver", "Bronze")
- value: the numeric face value in the original currency as a decimal number (e.g., 0.25 for a quarter, 1 for 1 rupee)
- currency: the ISO currency code (e.g., "USD", "INR", "EUR")
- condition: assess the physical condition honestly (e.g., "Poor", "Fair", "Good", "Fine", "Very Fine", "Extremely Fine", "About Uncirculated", "Uncirculated")
- rarity: assess the intrinsic rarity based on age, mintage, and historical significance (e.g., "Common", "Uncommon", "Scarce", "Rare", "Very Rare", "Extremely Rare")
- estimatedValue: estimated collector/market value in USD considering BOTH rarity/age AND condition (e.g., 5.50 for $5.50)
- estimatedValueRange: a range showing possible value variation (e.g., "$3-$8", "$50-$150")
- valueFactors: array of factors affecting the value, noting both positive (age, rarity) and negative (poor condition) factors (e.g., ["Very old (1800s)", "Historically significant", "Poor condition reduces value", "Rare mintage year"])

When estimating value, consider:
1. Age: Older coins are often more valuable, even when worn or dirty
2. Rarity: Low mintage numbers, special editions, or errors can make even dirty coins valuable
3. Condition: Better preserved coins command higher prices, but rare/old coins retain value even in poor condition
4. Historical significance: Coins from important periods or events maintain value
5. Demand: Popular coins among collectors
6. Material: Silver, gold, or other precious metals add intrinsic value

REMEMBER: A dirty, worn coin from the 1800s can be worth much more than a pristine modern coin. Always identify and assess the underlying rarity and age-based value, even if the physical appearance is poor.

Be as accurate as possible. If you cannot identify the coin clearly due to damage or dirt, provide your best guess with a lower confidence score, but still attempt to estimate age and rarity.`;

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
              isCoin: { type: "boolean" },
              actualObject: { type: "string" },
              coinType: { type: "string" },
              country: { type: "string" },
              countryFlag: { type: "string" },
              denomination: { type: "string" },
              year: { type: ["string", "number"] },
              confidence: { type: "number" },
              material: { type: "string" },
              value: { type: "number" },
              currency: { type: "string" },
              condition: { type: "string" },
              rarity: { type: "string" },
              estimatedValue: { type: "number" },
              estimatedValueRange: { type: "string" },
              valueFactors: { 
                type: "array",
                items: { type: "string" }
              },
            },
            required: ["isCoin"],
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
