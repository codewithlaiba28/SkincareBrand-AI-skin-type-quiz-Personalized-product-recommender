import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/db';
import { chatSessions, quizResults } from '@/db/schema';
import { eq } from 'drizzle-orm';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { messages, sessionId = 'default-session-id' } = await req.json();
    
    // Fetch the user's quiz profile from DB based on session to personalize responses.
    let userProfile = "";
    try {
      const results = await db.select().from(quizResults).where(eq(quizResults.sessionId, sessionId)).limit(1);
      if (results.length > 0) {
        const profile = results[0];
        userProfile = `\nThe user's skin profile: Skin Type is ${profile.skinType}. Main concerns are ${profile.concerns?.join(", ")}. Tailor your advice and recommendations to this profile.`;
      }
    } catch (e) {
      console.error("Failed to fetch user profile for chat context:", e);
    }
    
    const systemPrompt = `
      You are an elegant, friendly, and highly knowledgeable AI skincare assistant for the premium brand "BeautySkin".
      Your tone is helpful, warm, and sophisticated.
      You provide advice on skincare routines, ingredients, and product recommendations from our brand.
      If a user asks something completely unrelated to skincare, beauty, or customer service, politely steer the conversation back or decline to answer.${userProfile}
    `;

    // Format messages for Gemini Chat
    const formattedMessages = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // Start chat with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood. I am ready to help.' }] },
        ...formattedMessages.slice(0, -1) // All except the latest user message
      ],
    });

    const latestUserMessage = formattedMessages[formattedMessages.length - 1].parts[0].text;
    const result = await chat.sendMessage(latestUserMessage);
    const responseText = await result.response.text();

    // In a real app we would save to Neon here:
    // await db.insert(chatSessions).values({ sessionId, messages: [...messages, { role: 'assistant', content: responseText }] }).onConflictDoUpdate(...);

    return NextResponse.json({ reply: responseText });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
