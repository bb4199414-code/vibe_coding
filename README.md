# FIFA Nexus AI 🏟️⚡

> **Ultra-premium GenAI-enabled stadium operations and tournament experience hub for the FIFA World Cup 2026.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-23%20passing-brightgreen)](./src)
[![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

---

## ✨ Features

### 🎯 Fan Portal (`/fan-hub`)
- Live match status & scoreboard
- Real-time transit & accessibility route status
- Interactive FAQ accordion (Public Transit, ADA Routes, Food Wait Times)
- One-click activation of the Nexus AI assistant

### ⚡ Staff Command Center (`/staff`)
- KPI dashboard: Attendance, Gate Flow, Sustainability Score
- Live crowd density heatmap (visual)
- AI-powered GenAI Incident Reports generated on demand via Gemini API
- Append-style report feed with fade-in animations

### 🤖 Nexus AI Chat (Global, all pages)
- Floating AI chat assistant powered by Google Gemini 2.5 Flash
- Handles stadium navigation, food wait times, and accessibility queries
- Rate-limited (10 req/min/IP) with demo mode fallback when no API key is set

---

## 🛡️ Security

- **Content-Security-Policy** header on all routes
- **X-Frame-Options: DENY** (Clickjacking protection)
- **X-Content-Type-Options: nosniff** (MIME sniffing protection)
- **Strict-Transport-Security** (forces HTTPS)
- **Rate Limiting** — 10 req/min/IP on all AI API routes
- **Input Validation** — max 1000 chars, type-checked, sanitized
- **Malformed JSON protection** — graceful 400 response on bad request bodies

---

## ♿ Accessibility

- Correct heading hierarchy (`h1 → h2`) across all pages
- `aria-live="polite"` on AI chat message stream
- `aria-expanded` / `aria-controls` on all accordion toggles
- `role="region"` with `aria-label` on dynamic content panels
- `prefers-reduced-motion` media query — WCAG 2.1 SC 2.3.3 compliant
- `:focus-visible` keyboard navigation ring

---

## 🧪 Testing

**23 tests** across 6 test files — all passing.

```bash
npm run test
```

| Test File | Coverage |
|-----------|----------|
| `page.test.tsx` | Landing page rendering |
| `fan-hub.test.tsx` | FAQ accordion, aria-expanded, accordion exclusivity |
| `staff.test.tsx` | KPIs, report generation, error handling, loading states |
| `ChatModal.test.tsx` | Open/close, send, Enter key, network errors, disabled state |
| `chat/route.test.ts` | Validation, rate limiting, malformed JSON, Gemini error |
| `report/route.test.ts` | Mock mode, Gemini API integration |

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment (optional — demo mode works without it)
```bash
# Create a .env.local file
GEMINI_API_KEY=your_google_gemini_api_key_here
```

> Without an API key, the app runs in **Demo Mode** with realistic simulated AI responses.

### 3. Start development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run tests
```bash
npm run test
```

### 5. Lint
```bash
npm run lint
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| AI | Google Gemini 2.5 Flash via `@google/genai` |
| Styling | Vanilla CSS with Glassmorphism |
| Testing | Vitest + React Testing Library |
| Font | Inter (Google Fonts) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts       # AI chat endpoint (rate-limited, validated)
│   │   └── report/route.ts     # AI operations report endpoint
│   ├── fan-hub/page.tsx        # Fan Portal page
│   ├── staff/page.tsx          # Staff Command Center
│   ├── __tests/                # Page & API integration tests
│   ├── layout.tsx              # Root layout with ChatModal
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global design system
├── components/
│   ├── ChatModal.tsx           # Global AI assistant modal
│   └── __tests/                # Component tests
└── test-setup.ts               # Vitest + jest-dom setup
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | No | Google Gemini API key. Without it, app runs in demo mode. |

---

*Built for the FIFA World Cup 2026 — Powered by Google Gemini AI*
