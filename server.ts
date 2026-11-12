import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '20mb' }));

// Server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Advisor Endpoint (BASKT Assistant)
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Fallback intelligent response if no API key is available
  if (!ai) {
    const fallback = generateFallbackChatResponse(message);
    return res.json(fallback);
  }

  try {
    const systemInstruction = `You are BASKT AI Concierge, the personal shopping advisor for BASKT — a Skyscanner-like price comparison engine for elevated everyday goods priced between $50 and $2,000 across 5 core categories:
1. Electronics (headphones, mechanical keyboards, mice, speakers, coffee machines, monitors)
2. Watches (automatic, quartz, field, dress, dive watches, luxury smartwatches)
3. Perfume / Toiletries (niche fragrances, eau de parfum, luxury soaps, Aesop skincare)
4. Branded Bags (leather totes, backpacks, designer slings, travel duffels)
5. Organic Expensive Food (ceremonial matcha, manuka honey, artisanal single-origin coffee, Iberian ham, white truffle oil)

Key Persona & Rules:
- When a user asks generally (e.g. "I need a mouse", "I need a watch", "Looking for a perfume"), do NOT give a generic dry list. Help them narrow down features by asking smart, conversational questions:
  * E.g. For a mouse: Do you need a silent click for the office, an ergonomic vertical shape, or high-polling gaming?
  * E.g. For a watch: Automatic mechanical or quartz? Clean dress style or rugged dive/field watch?
  * E.g. For perfume: Fresh citrus/woody for daily wear, or rich amber/smoky for evenings?
- Recommend 2-3 specific real products with approximate price range in SGD/USD ($50 - $2,000) and indicate where to check prices (Shopee, Lazada, Amazon, Apple, Sephora, Taobao).
- Provide 3-4 interactive quick-reply suggestion chips for the user to click next.
- Keep tone sophisticated, concise, helpful, and value-conscious.
- Format your response as valid JSON with keys:
  "reply": "string (markdown allowed for formatting)",
  "suggestedChips": ["short phrase 1", "short phrase 2", "short phrase 3"],
  "recommendedCategory": "electronics" | "watches" | "perfumes" | "bags" | "food" | null,
  "searchKeyword": "string to auto-filter BASKT catalog, e.g. 'MX Master 3S' or 'Logitech'"`;

    const contents = [];
    if (Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const contentPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI timeout')), 6000)
    );

    const response = await Promise.race([contentPromise, timeoutPromise]);

    const text = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        reply: text,
        suggestedChips: ['Silent mouse', 'Ergonomic mouse', 'Under $150', 'Show deals'],
        recommendedCategory: null,
        searchKeyword: '',
      };
    }
    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    // Return graceful fallback
    const fallback = generateFallbackChatResponse(message);
    return res.json(fallback);
  }
});

// AI Visual Search Endpoint
app.post('/api/gemini/visual-search', async (req: Request, res: Response) => {
  const { imageBase64, mimeType } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'Image base64 data required' });
  }

  const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  if (!ai) {
    return res.json({
      productName: 'Identified Premium Item',
      category: 'electronics',
      brand: 'Popular Brand',
      estimatedPriceRange: '$120 - $250',
      description: 'Identified elevated everyday product from image features.',
      matchingKeywords: ['wireless', 'premium', 'noise cancelling'],
    });
  }

  try {
    const prompt = `Analyze this product photo for BASKT price comparison. BASKT compares elevated everyday goods ($50 - $2,000) in 5 categories: Electronics, Watches, Perfume/Toiletries, Branded Bags, Organic Expensive Food.
Identify:
1. Product name or closest equivalent product
2. Category (one of: 'electronics', 'watches', 'perfumes', 'bags', 'food')
3. Likely brand
4. Estimated typical retail price range (e.g. "$120 - $180")
5. 2-3 key distinguishing features
6. Suggested search keyword to query in BASKT

Return ONLY a JSON object:
{
  "productName": "string",
  "category": "electronics" | "watches" | "perfumes" | "bags" | "food",
  "brand": "string",
  "estimatedPriceRange": "string",
  "features": ["feature 1", "feature 2"],
  "suggestedSearch": "string"
}`;

    const contentPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Visual search timeout')), 6000)
    );

    const response = await Promise.race([contentPromise, timeoutPromise]);

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini visual search error:', error);
    return res.json({
      productName: 'Identified Item',
      category: 'electronics',
      brand: 'Recognized Brand',
      estimatedPriceRange: '$80 - $220',
      features: ['Elevated everyday design', 'Premium materials'],
      suggestedSearch: 'gadget',
    });
  }
});

function generateFallbackChatResponse(userMessage: string) {
  const query = userMessage.toLowerCase();

  if (query.includes('mouse') || query.includes('keyboard') || query.includes('headphone') || query.includes('tech')) {
    return {
      reply: `For your tech setup, tell me what matters most:
- **For office & productivity**: A whisper-silent click with ergonomic palm support (like the **Logitech MX Master 3S**, ~$118-$149).
- **For competitive gaming**: Ultralight chassis with 8000Hz polling rate and optical switches (like **Razer Viper V3 Pro**, ~$219-$249).
- **For minimal travel**: Low-profile Bluetooth multi-device mouse.

Which scenario fits your daily routine best?`,
      suggestedChips: ['Silent / Office Work', 'Ergonomic Support', 'Competitive Gaming', 'Under $100'],
      recommendedCategory: 'electronics',
      searchKeyword: 'Logitech MX Master 3S',
    };
  }

  if (query.includes('watch') || query.includes('timepiece') || query.includes('wrist')) {
    return {
      reply: `Looking for an elevated timepiece? In the $150–$1,200 range, we recommend narrowing by movement and occasion:
- **Everyday Automatic / Mechanical**: *Tissot PRX Powermatic 80* (~$720–$890) or *Seiko 5 GMT* (~$450–$580).
- **Outdoor / Field Explorer**: *Hamilton Khaki Field Mechanical* (~$680–$790).
- **Luxury Smart Hybrid**: *Garmin Epix Gen 2* (~$950–$1,180).

Do you prefer mechanical craftsmanship or quartz/smart convenience?`,
      suggestedChips: ['Automatic Mechanical', 'Everyday Dress Style', 'Dive / Sports Watch', 'Under $500'],
      recommendedCategory: 'watches',
      searchKeyword: 'Tissot PRX',
    };
  }

  if (query.includes('perfume') || query.includes('fragrance') || query.includes('scent') || query.includes('soap')) {
    return {
      reply: `Let's find your signature elevated scent! Fragrances differ greatly by mood and sillage:
- **Clean Woody / Subtle Sophistication**: *Le Labo Santal 33* or *Diptyque Philosykos* (Fresh fig leaves and cedar).
- **Warm / Evening Seduction**: *Maison Margiela Replica Jazz Club* (Rum, vanilla, and tobacco leaf).
- **Elevated Daily Ritual**: *Aesop Resurrection Aromatique Hand Balm & Wash*.

Are you shopping for everyday office wear or special occasions?`,
      suggestedChips: ['Fresh & Woody', 'Warm & Amber', 'Niche Fragrance', 'Under $200'],
      recommendedCategory: 'perfumes',
      searchKeyword: 'Le Labo Santal 33',
    };
  }

  if (query.includes('bag') || query.includes('tote') || query.includes('backpack')) {
    return {
      reply: `For elevated daily carry between $150 and $1,400:
- **The Modern Commuter**: *Bellroy Transit Workpack 20L* (~$289–$340) — weather-resistant and dedicated laptop divider.
- **The Iconic Parisian Chic**: *Longchamp Le Pliage Energy Tote* (~$340–$420) or *Polène Numéro Dix* (~$620–$750).
- **Luxury Statement**: *Coach Tabby Shoulder Bag 26* (~$650–$790).

What size carry capacity are you looking for?`,
      suggestedChips: ['Commuter Laptop Bag', 'Everyday Leather Shoulder', 'Weekend Travel Duffel', 'Under $400'],
      recommendedCategory: 'bags',
      searchKeyword: 'Coach Tabby',
    };
  }

  if (query.includes('food') || query.includes('coffee') || query.includes('matcha') || query.includes('honey')) {
    return {
      reply: `For artisanal & organic gastronomy:
- **Morning Ritual**: *Ippodo Ceremonial Grade Uji Matcha* (~$68–$85) or *Artisanal Single-Origin Geisha Coffee*.
- **Wellness Superfood**: *Comvita Raw Manuka Honey UMF 20+ / MGO 829+* (~$158–$195).
- **Gourmet Pantry**: *Urbani White Truffle Olive Oil* (~$58–$72) and *Cinco Jotas 100% Ibérico Bellota Ham*.

What kind of delicacy are you craving?`,
      suggestedChips: ['Ceremonial Matcha', 'Raw Manuka Honey 20+', 'Specialty Coffee', 'Truffle & Iberico'],
      recommendedCategory: 'food',
      searchKeyword: 'Ceremonial Matcha',
    };
  }

  return {
    reply: `Welcome to **BASKT**! I help you compare prices and discover elevated goods ($50–$2,000) across Electronics, Watches, Perfumes, Branded Bags, and Gourmet Food. Tell me what item you're looking for, or pick a scenario below to narrow down your options!`,
    suggestedChips: ['Ergonomic mouse for work', 'Automatic watch under $600', 'Long-lasting office fragrance', 'Leather laptop bag'],
    recommendedCategory: null,
    searchKeyword: '',
  };
}

// Development vs Production serving
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`BASKT server running on http://localhost:${PORT}`);
  });
}

startServer();
