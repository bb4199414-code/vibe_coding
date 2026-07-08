import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Cache for GoogleGenAI instance to improve efficiency
let cachedAIInstance: GoogleGenAI | null = null;
let cachedApiKey = "";

function getGoogleGenAI(apiKey: string): GoogleGenAI {
  if (!cachedAIInstance || cachedApiKey !== apiKey) {
    cachedAIInstance = new GoogleGenAI({ apiKey });
    cachedApiKey = apiKey;
  }
  return cachedAIInstance;
}

// Simple in-memory rate limiter: max 10 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 10;

export async function POST(req: NextRequest) {
  try {
    // Parse and validate body first, before spending rate limit budget
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { reply: "Invalid request body. JSON expected." },
        { status: 400 }
      );
    }

    const { message } = body;

    // Input Validation
    if (!message || typeof message !== "string" || (message as string).trim().length === 0) {
      return NextResponse.json(
        { reply: "Invalid message payload." },
        { status: 400 }
      );
    }

    if ((message as string).length > 1000) {
      return NextResponse.json(
        { reply: "Message is too long. Please limit your message to 1000 characters." },
        { status: 400 }
      );
    }

    const sanitizedMessage = (message as string).trim();

    // Rate limiting (applied after validation to avoid wasting budget on bad requests)
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();

    // Cleanup expired entries periodically to prevent memory leaks
    const oneMinAgo = now - RATE_LIMIT_WINDOW;
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.lastReset < oneMinAgo) {
        rateLimitMap.delete(key);
      }
    }

    const limitData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - limitData.lastReset > RATE_LIMIT_WINDOW) {
      limitData.count = 1;
      limitData.lastReset = now;
    } else {
      limitData.count++;
    }
    rateLimitMap.set(ip, limitData);

    if (limitData.count > MAX_REQUESTS) {
      return NextResponse.json(
        { reply: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      // Mock response for showcase if no API key is set to avoid crashing the demo
      if (process.env.NODE_ENV !== "test") {
        await new Promise(r => setTimeout(r, 1200));
      }
      return NextResponse.json({ 
        reply: `(Demo Mode - No API Key) You said: "${sanitizedMessage}". I'm Nexus AI. For the 2026 World Cup, I can help you find Gate C, check the wait time for Hot Dogs (currently 5 mins), or find the nearest accessible restroom.` 
      });
    }

    const ai = getGoogleGenAI(process.env.GEMINI_API_KEY);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: sanitizedMessage,
      config: {
        systemInstruction: "You are FIFA Nexus AI, a highly advanced, premium multilingual assistant for the 2026 World Cup. You help fans with stadium navigation, food wait times, transport, and accessibility routes. Keep responses concise, helpful, and friendly."
      }
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { reply: "Sorry, the Nexus AI system is currently experiencing high traffic. Please try again." },
      { status: 500 }
    );
  }
}
