"use client";

import { useState } from "react";
import Link from "next/link";

interface OperationReport {
  id: string;
  title: string;
  content: string;
  type: "pink" | "teal" | "purple";
}

export default function StaffDashboard() {
  const [reports, setReports] = useState<OperationReport[]>([
    {
      id: "1",
      title: "AI Summary: Gate D Congestion",
      content: "Fan portal chats indicate a spike in queries for Gate D. Recommend opening overflow lanes immediately.",
      type: "pink",
    },
    {
      id: "2",
      title: "Sustainability Alert",
      content: "HVAC usage in Sector 4 is exceeding baseline. AI has adjusted temps to save 12% energy without affecting comfort.",
      type: "teal",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const generateNewReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch report");
      
      const data = await response.json();
      const newReport: OperationReport = {
        id: Date.now().toString(),
        title: `AI Intelligence Report (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })})`,
        content: data.report,
        type: Math.random() > 0.5 ? "purple" : "pink",
      };
      
      setReports((prev) => [newReport, ...prev]);
    } catch (error) {
      console.error("Failed to generate AI report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Command Center</h1>
          <p style={{ color: "var(--text-muted)" }}>Operational Intelligence for FIFA World Cup 2026</p>
        </div>
        <Link href="/" className="btn-primary" style={{ textDecoration: "none" }}>← Back to Hub</Link>
      </header>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
        {/* KPI Card 1 */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h2 style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "0.5rem" }}>Total Attendance</h2>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--color-neon-teal)" }}>82,450</div>
          <div style={{ fontSize: "0.9rem", color: "rgba(16, 185, 129, 0.8)", marginTop: "0.5rem" }}>↑ 5% above predicted</div>
        </div>

        {/* KPI Card 2 */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h2 style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "0.5rem" }}>Gate Flow (Avg Wait)</h2>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--color-neon-purple)" }}>4.2 min</div>
          <div style={{ fontSize: "0.9rem", color: "rgba(155, 38, 182, 0.8)", marginTop: "0.5rem" }}>Optimal flow detected</div>
        </div>

        {/* KPI Card 3 */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h2 style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "0.5rem" }}>Sustainability Score</h2>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--color-neon-pink)" }}>94/100</div>
          <div style={{ fontSize: "0.9rem", color: "rgba(236, 72, 153, 0.8)", marginTop: "0.5rem" }}>Energy grid stable</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Live Crowd Density Heatmap</h2>
          <div style={{ 
            height: "400px", 
            borderRadius: "12px", 
            background: "linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(155, 38, 182, 0.1))",
            position: "relative",
            overflow: "hidden",
            border: "1px solid var(--glass-border)"
          }}>
            {/* Simulated Heatmap Spots */}
            <div style={{ position: "absolute", top: "20%", left: "30%", width: "150px", height: "150px", background: "radial-gradient(circle, rgba(236,72,153,0.6) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(20px)" }} />
            <div style={{ position: "absolute", top: "60%", left: "70%", width: "100px", height: "100px", background: "radial-gradient(circle, rgba(155,38,182,0.6) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(20px)" }} />
            <div style={{ position: "absolute", top: "40%", left: "50%", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(20px)" }} />
            
            <div style={{ position: "absolute", bottom: "1rem", left: "1rem", background: "rgba(0,0,0,0.5)", padding: "0.5rem 1rem", borderRadius: "8px", fontSize: "0.9rem" }}>
              <span style={{ color: "var(--color-neon-pink)" }}>● High</span> &nbsp;
              <span style={{ color: "var(--color-neon-purple)" }}>● Med</span> &nbsp;
              <span style={{ color: "var(--color-neon-teal)" }}>● Low</span>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>GenAI Incident Reports</h2>
          
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem", overflowY: "auto", maxHeight: "350px", paddingRight: "0.5rem" }}>
            {reports.map((report) => {
              const borderColor = report.type === "pink" 
                ? "var(--color-neon-pink)" 
                : report.type === "teal" 
                ? "var(--color-neon-teal)" 
                : "var(--color-neon-purple)";
              return (
                <div 
                  key={report.id} 
                  style={{ 
                    background: "rgba(255,255,255,0.05)", 
                    padding: "1rem", 
                    borderRadius: "12px", 
                    borderLeft: `4px solid ${borderColor}`, 
                    transition: "all var(--transition-speed) ease",
                    animation: "fadeIn 0.5s ease-out"
                  }}
                >
                  <strong style={{ display: "block", marginBottom: "0.3rem" }}>{report.title}</strong>
                  <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.5, display: "block", whiteSpace: "pre-line" }}>
                    {report.content}
                  </span>
                </div>
              );
            })}
          </div>

          <button 
            className="btn-primary" 
            onClick={generateNewReport}
            disabled={isLoading}
            style={{ 
              marginTop: "2rem", 
              width: "100%", 
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? "not-allowed" : "pointer" 
            }}
          >
            {isLoading ? "Generating report..." : "Generate New AI Report"}
          </button>
        </div>
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
