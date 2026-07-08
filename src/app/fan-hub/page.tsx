"use client";

import Link from "next/link";
import { useState } from "react";

export default function FanHub() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const faqItems = [
    {
      topic: "🚌 Public Transit",
      content: "Shuttles run every 5 minutes from Central Station. Free rides with match tickets.",
    },
    {
      topic: "♿ Accessibility Routes",
      content: "ADA compliant elevators are operational in Sectors 2, 4, and 7. Ramps are located next to Gate C.",
    },
    {
      topic: "🍔 Food Wait Times",
      content: "Hot dog stand: 5m, Tacos: 8m, Beverages: 3m. Sector 3 food court is currently the least crowded.",
    },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Fan Portal</h1>
          <p style={{ color: "var(--text-muted)" }}>Real-Time Information & Navigation for FIFA World Cup 2026</p>
        </div>
        <Link href="/" className="btn-primary" style={{ textDecoration: "none" }}>← Back to Hub</Link>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
        {/* Match Card */}
        <div className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚽</span>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Match Status</h2>
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "12px", marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--color-neon-teal)", fontWeight: "bold", marginBottom: "0.5rem" }}>
              <span>LIVE - Min 72</span>
              <span>Group Stage</span>
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: "bold", display: "flex", justifyContent: "space-between" }}>
              <span>USA 🇺🇸</span>
              <span>2</span>
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: "bold", display: "flex", justifyContent: "space-between", marginTop: "0.3rem" }}>
              <span>England 🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
              <span>1</span>
            </div>
          </div>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", flexGrow: 1 }}>Next Match: Mexico 🇲🇽 vs Argentina 🇦🇷 at 20:00 local time.</p>
        </div>

        {/* Transit Status */}
        <div className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "2rem", marginBottom: "1rem" }}>🚌</span>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Transit & Access</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", flexGrow: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Stadium Express Shuttle</span>
              <span style={{ background: "rgba(16, 185, 129, 0.2)", color: "var(--color-neon-teal)", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem" }}>On Time</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Metro Line Red</span>
              <span style={{ background: "rgba(16, 185, 129, 0.2)", color: "var(--color-neon-teal)", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem" }}>On Time</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Gate A Flow Status</span>
              <span style={{ background: "rgba(236, 72, 153, 0.2)", color: "var(--color-neon-pink)", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem" }}>Heavy</span>
            </div>
          </div>
        </div>

        {/* Interactive FAQ / Intel */}
        <div className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "2rem", marginBottom: "1rem" }}>💡</span>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Quick Operations Intel</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {faqItems.map((item, index) => (
              <button
                key={index}
                id={`faq-btn-${index}`}
                aria-expanded={selectedTopic === item.topic}
                aria-controls={`faq-detail-${index}`}
                onClick={() => setSelectedTopic(selectedTopic === item.topic ? null : item.topic)}
                style={{
                  background: selectedTopic === item.topic ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "8px",
                  padding: "0.8rem",
                  color: "var(--text-main)",
                  textAlign: "left",
                  cursor: "pointer",
                  width: "100%",
                  fontWeight: "600",
                  transition: "all var(--transition-speed) ease"
                }}
              >
                {item.topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedTopic && (
        <div 
          className="glass-panel" 
          role="region"
          aria-label={`${selectedTopic} details`}
          style={{ 
            padding: "2rem", 
            marginBottom: "3rem", 
            borderLeft: "4px solid var(--color-neon-purple)",
            animation: "fadeIn 0.4s ease-out" 
          }}
        >
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{selectedTopic} Status</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
            {faqItems.find(item => item.topic === selectedTopic)?.content}
          </p>
        </div>
      )}

      {/* Floating Prompt Helper */}
      <div className="glass-panel" style={{ padding: "2.5rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Need Help? Ask Nexus AI</h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto 1.5rem auto", lineHeight: 1.6 }}>
          Our advanced GenAI assistant has real-time access to stadium cameras, ticketing services, and transit trackers. Click the floating magic button in the bottom right corner of your screen at any time to chat!
        </p>
        <button 
          className="btn-primary" 
          onClick={() => {
            const btn = document.querySelector('button[aria-label="Open AI Assistant"]') as HTMLButtonElement;
            if (btn) btn.click();
          }}
        >
          Activate Assistant Now
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
