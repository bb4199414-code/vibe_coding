import { POST } from "../route";
import { NextRequest } from "next/server";
import { expect, test, vi, beforeEach } from "vitest";

const mockGenerateContent = vi.fn().mockResolvedValue({
  text: "Mocked Gemini Response",
});

vi.mock("@google/genai", () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: mockGenerateContent,
      };
    },
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  delete process.env.GEMINI_API_KEY;
});

test("returns 400 for empty or invalid message", async () => {
  const req = new NextRequest("http://localhost:3000/api/chat", {
    method: "POST",
    body: JSON.stringify({ message: "" }),
  });

  const res = await POST(req);
  expect(res.status).toBe(400);
  const data = await res.json();
  expect(data.reply).toBe("Invalid message payload.");
});

test("returns 400 if message is too long", async () => {
  const req = new NextRequest("http://localhost:3000/api/chat", {
    method: "POST",
    body: JSON.stringify({ message: "a".repeat(1001) }),
  });

  const res = await POST(req);
  expect(res.status).toBe(400);
  const data = await res.json();
  expect(data.reply).toContain("Message is too long");
});

test("returns demo reply when GEMINI_API_KEY is not set", async () => {
  const req = new NextRequest("http://localhost:3000/api/chat", {
    method: "POST",
    body: JSON.stringify({ message: "Hello" }),
  });

  const res = await POST(req);
  expect(res.status).toBe(200);
  const data = await res.json();
  expect(data.reply).toContain("Demo Mode - No API Key");
});

test("calls Gemini API when GEMINI_API_KEY is set", async () => {
  process.env.GEMINI_API_KEY = "test-api-key";

  const req = new NextRequest("http://localhost:3000/api/chat", {
    method: "POST",
    body: JSON.stringify({ message: "Where is Gate C?" }),
  });

  const res = await POST(req);
  expect(res.status).toBe(200);
  const data = await res.json();
  expect(data.reply).toBe("Mocked Gemini Response");
});

test("rate limiter returns 429 after exceeding max requests", async () => {
  process.env.GEMINI_API_KEY = "test-api-key";

  // Call it 10 times (max limit)
  for (let i = 0; i < 10; i++) {
    const req = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "x-forwarded-for": "1.2.3.4" },
      body: JSON.stringify({ message: "Hello" }),
    });
    await POST(req);
  }

  // 11th call should return 429
  const req11 = new NextRequest("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "x-forwarded-for": "1.2.3.4" },
    body: JSON.stringify({ message: "Hello" }),
  });
  const res = await POST(req11);
  expect(res.status).toBe(429);
  const data = await res.json();
  expect(data.reply).toBe("Too many requests. Please try again later.");
});

test("returns 400 for malformed JSON body", async () => {
  const req = new NextRequest("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "9.9.9.9" },
    body: "not-valid-json",
  });

  const res = await POST(req);
  expect(res.status).toBe(400);
  const data = await res.json();
  expect(data.reply).toContain("Invalid request body");
});

test("returns 500 when Gemini API throws", async () => {
  process.env.GEMINI_API_KEY = "test-api-key";
  mockGenerateContent.mockRejectedValueOnce(new Error("Gemini downstream error"));

  const req = new NextRequest("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "x-forwarded-for": "8.8.8.8" },
    body: JSON.stringify({ message: "Will this crash?" }),
  });

  const res = await POST(req);
  expect(res.status).toBe(500);
  const data = await res.json();
  expect(data.reply).toContain("high traffic");
});

