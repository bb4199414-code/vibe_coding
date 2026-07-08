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
  const [error, setError] = useState<string | null>(null);

  const generateNewReport = async () => {
    setIsLoading(true);
    setError(null);
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
    } catch (err) {
      console.error("Failed to generate AI report:", err);
      setError("Failed to generate AI report. Please check server status.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Command Center</h1>
          <p style={{ color: "var(--text-muted)" }}>Operational Intelligence for FIFA World Cup 2026</p>
        </div>
        <Link href="/" className="btn-primary back-btn">← Back to Hub</Link>
      </header>
      
      <div className="kpi-grid">
        {/* KPI Card 1 */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h2 className="kpi-label">Total Attendance</h2>
          <div className="kpi-value teal">82,450</div>
          <div className="kpi-footer teal">↑ 5% above predicted</div>
        </div>

        {/* KPI Card 2 */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h2 className="kpi-label">Gate Flow (Avg Wait)</h2>
          <div className="kpi-value purple">4.2 min</div>
          <div className="kpi-footer purple">Optimal flow detected</div>
        </div>

        {/* KPI Card 3 */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h2 className="kpi-label">Sustainability Score</h2>
          <div className="kpi-value pink">94/100</div>
          <div className="kpi-footer pink">Energy grid stable</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h2 className="card-title" style={{ marginBottom: "1.5rem" }}>Live Crowd Density Heatmap</h2>
          <div className="heatmap-container">
            {/* Simulated Heatmap Spots */}
            <div style={{ position: "absolute", top: "20%", left: "30%", width: "150px", height: "150px", background: "radial-gradient(circle, rgba(236,72,153,0.6) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(20px)" }} />
            <div style={{ position: "absolute", top: "60%", left: "70%", width: "100px", height: "100px", background: "radial-gradient(circle, rgba(155,38,182,0.6) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(20px)" }} />
            <div style={{ position: "absolute", top: "40%", left: "50%", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(20px)" }} />
            
            <div className="heatmap-legend">
              <span style={{ color: "var(--color-neon-pink)" }}>● High</span> &nbsp;
              <span style={{ color: "var(--color-neon-purple)" }}>● Med</span> &nbsp;
              <span style={{ color: "var(--color-neon-teal)" }}>● Low</span>
            </div>
          </div>
        </div>

        <div className="glass-panel info-card">
          <h2 className="card-title" style={{ marginBottom: "1.5rem" }}>GenAI Incident Reports</h2>
          
          {error && (
            <div className="error-banner" role="alert">
              ⚠️ {error}
            </div>
          )}

          <div className="reports-feed">
            {reports.map((report) => {
              const borderColor = report.type === "pink" 
                ? "var(--color-neon-pink)" 
                : report.type === "teal" 
                ? "var(--color-neon-teal)" 
                : "var(--color-neon-purple)";
              return (
                <div 
                  key={report.id} 
                  className="report-card"
                  style={{ 
                    borderLeft: `4px solid ${borderColor}`
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
            className="btn-primary report-gen-btn" 
            onClick={generateNewReport}
            disabled={isLoading}
            style={{ 
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? "not-allowed" : "pointer" 
            }}
          >
            {isLoading ? "Generating report..." : "Generate New AI Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
