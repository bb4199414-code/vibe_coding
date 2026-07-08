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
    // Rate limiting
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
        { report: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const stats = {
      attendance: 82450,
      avgWait: "4.2 min",
      sustainability: "94/100",
      timestamp: new Date().toLocaleTimeString(),
    };

    if (!process.env.GEMINI_API_KEY) {
      // Mock report for showcase if no API key is set to avoid crashing the demo
      if (process.env.NODE_ENV !== "test") {
        await new Promise(r => setTimeout(r, 1500));
      }
      return NextResponse.json({ 
        report: `### 🏟️ FIFA Stadium Operations Report
Generated at: **${stats.timestamp}**

* **Crowd Density Alert:** Minor bottleneck detected at **Gate D** (escalating flow). Overflow lanes activated at 1:15 AM.
* **Gate Operations:** Flow rate is optimal across Gates A, B, and C. Average wait time remains steady at **${stats.avgWait}**.
* **Sustainability Hub:** HVAC optimization in Sector 4 completed. Energy savings estimated at **12%** for the next 2 hours.
* **Staff Dispatch:** 5 guest services staff reassigned from Gate A to Gate D to handle inbound rush.
`
      });
    }

    const ai = getGoogleGenAI(process.env.GEMINI_API_KEY);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a short, premium, professional FIFA World Cup 2026 Stadium Operations Report based on these current live operational metrics:
- Attendance: ${stats.attendance}
- Avg Gate Wait Time: ${stats.avgWait}
- Sustainability score: ${stats.sustainability}
- Generated time: ${stats.timestamp}

Format the response using beautiful, clean Markdown bullet points. Keep it concise (3-4 bullet points), highly realistic for a command center operator, and actionable. Add operational suggestions such as dispatching staff or modifying HVAC/gate operations.`,
    });

    return NextResponse.json({ report: response.text });
  } catch (error) {
    console.error("AI Report Error:", error);
    return NextResponse.json(
      { report: "Failed to generate AI operational report. Please check server logs." },
      { status: 500 }
    );
  }
}
