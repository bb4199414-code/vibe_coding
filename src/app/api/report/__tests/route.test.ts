import { POST } from "../route";
import { NextRequest } from "next/server";
import { expect, test, vi, beforeEach } from "vitest";

const mockGenerateReport = vi.fn().mockResolvedValue({
  text: "Mocked Gemini Operations Report Response",
});

vi.mock("@google/genai", () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: mockGenerateReport,
      };
    },
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  delete process.env.GEMINI_API_KEY;
});

test("returns mock report when GEMINI_API_KEY is not set", async () => {
  const req = new NextRequest("http://localhost:3000/api/report", {
    method: "POST",
  });

  const res = await POST(req);
  expect(res.status).toBe(200);
  const data = await res.json();
  expect(data.report).toContain("FIFA Stadium Operations Report");
});

test("calls Gemini API to generate report when GEMINI_API_KEY is set", async () => {
  process.env.GEMINI_API_KEY = "test-api-key";

  const req = new NextRequest("http://localhost:3000/api/report", {
    method: "POST",
  });

  const res = await POST(req);
  expect(res.status).toBe(200);
  const data = await res.json();
  expect(data.report).toBe("Mocked Gemini Operations Report Response");
});
