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
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Fan Portal</h1>
          <p style={{ color: "var(--text-muted)" }}>Real-Time Information & Navigation for FIFA World Cup 2026</p>
        </div>
        <Link href="/" className="btn-primary back-btn">← Back to Hub</Link>
      </header>

      <div className="hub-grid">
        {/* Match Card */}
        <div className="glass-panel info-card">
          <span className="card-icon">⚽</span>
          <h2 className="card-title">Match Status</h2>
          <div className="match-board">
            <div className="match-header">
              <span>LIVE - Min 72</span>
              <span>Group Stage</span>
            </div>
            <div className="match-team-row">
              <span>USA 🇺🇸</span>
              <span>2</span>
            </div>
            <div className="match-team-row mt-1">
              <span>England 🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
              <span>1</span>
            </div>
          </div>
          <p className="match-footer">Next Match: Mexico 🇲🇽 vs Argentina 🇦🇷 at 20:00 local time.</p>
        </div>

        {/* Transit Status */}
        <div className="glass-panel info-card">
          <span className="card-icon">🚌</span>
          <h2 className="card-title">Transit & Access</h2>
          <div className="transit-list">
            <div className="transit-row">
              <span>Stadium Express Shuttle</span>
              <span className="status-pill status-green">On Time</span>
            </div>
            <div className="transit-row">
              <span>Metro Line Red</span>
              <span className="status-pill status-green">On Time</span>
            </div>
            <div className="transit-row">
              <span>Gate A Flow Status</span>
              <span className="status-pill status-pink">Heavy</span>
            </div>
          </div>
        </div>

        {/* Interactive FAQ / Intel */}
        <div className="glass-panel info-card">
          <span className="card-icon">💡</span>
          <h2 className="card-title">Quick Operations Intel</h2>
          <div className="faq-list">
            {faqItems.map((item, index) => (
              <div key={index} className="faq-item">
                <button
                  id={`faq-btn-${index}`}
                  aria-expanded={selectedTopic === item.topic}
                  aria-controls={`faq-detail-${index}`}
                  onClick={() => setSelectedTopic(selectedTopic === item.topic ? null : item.topic)}
                  className="faq-btn"
                  style={{
                    background: selectedTopic === item.topic ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)"
                  }}
                >
                  {item.topic}
                </button>
                {selectedTopic === item.topic && (
                  <div
                    id={`faq-detail-${index}`}
                    role="region"
                    aria-labelledby={`faq-btn-${index}`}
                    className="faq-panel"
                  >
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Prompt Helper */}
      <div className="glass-panel help-banner">
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Need Help? Ask Nexus AI</h2>
        <p className="help-desc">
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
    </div>
  );
}
