import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/db';
import { quizResults } from '@/db/schema';
import crypto from 'crypto';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const answers = await req.json();
    
    // In a real app, sessionId would be from cookies/auth
    const sessionId = crypto.randomUUID(); 

    const catalogStr = `
    1. Glow Face Serum (Dry, Normal, Anti-aging)
    2. Hydrating Cream (Dry, Sensitive)
    3. Vitamin C Toner (Oily, Combination, Brightening)
    4. Exfoliating Scrub (Oily, Normal, Acne)
    5. Night Repair Oil (Dry, Anti-aging)
    6. Daily Sunscreen SPF 50 (All, Protection)
    7. Purifying Clay Mask (Oily, Acne, Combination)
    8. Rosewater Mist (Sensitive, Dry, Redness)
    9. Nourishing Lip Balm (Dry, All)
    10. Revitalizing Body Lotion (Dry, Normal)
    11. Gentle Foaming Cleanser (Sensitive, Normal)
    12. Advanced Eye Cream (Anti-aging, Dark Circles)
    `;

    const prompt = `
      You are an expert AI dermatologist and skincare specialist for an elegant beauty brand called "BeautySkin".
      Analyze these user answers to a skincare quiz:
      ${JSON.stringify(answers)}
      
      Provide a highly personalized skincare profile and routine. 
      You MUST return your response as STRICT JSON with exactly this structure, with NO markdown formatting around it:
      {
        "skinType": "The user's overall skin type (e.g. Dry, Oily, Combination, Sensitive)",
        "concerns": ["List of 2-3 main concerns based on answers"],
        "recommendedRoutine": {
          "AM": ["Step 1 description", "Step 2 description", "Step 3 description"],
          "PM": ["Step 1 description", "Step 2 description", "Step 3 description"]
        },
        "recommendedProducts": [
          {"name": "EXACT Name from Catalog", "reason": "Why it's good for them (max 1 sentence)"},
          {"name": "EXACT Name from Catalog", "reason": "Why it's good for them (max 1 sentence)"}
        ]
      }
      
      Here is our product catalog. You MUST ONLY recommend products from this list:
      ${catalogStr}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON
    let parsedResult;
    try {
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleanText);
    } catch (e) {
      console.error("Failed to parse Gemini response:", text);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    // Save to Neon DB
    await db.insert(quizResults).values({
      sessionId,
      skinType: parsedResult.skinType,
      concerns: parsedResult.concerns,
      recommendedRoutine: parsedResult.recommendedRoutine,
      recommendedProducts: parsedResult.recommendedProducts,
    });

    return NextResponse.json({ ...parsedResult, sessionId });
  } catch (error) {
    console.error("Quiz API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
