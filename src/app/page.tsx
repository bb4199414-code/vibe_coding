import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "4rem 2rem", maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
      <header style={{ textAlign: "center", marginBottom: "5rem", marginTop: "2rem" }}>
        <h1 style={{ fontSize: "4.5rem", marginBottom: "1.5rem", lineHeight: 1.1 }}>
          Welcome to <br/><span className="gradient-text">FIFA Nexus AI</span>
        </h1>
        <p style={{ fontSize: "1.25rem", color: "var(--text-muted)", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6 }}>
          The ultra-premium GenAI-enabled stadium operations and tournament experience hub for the FIFA World Cup 2026.
        </p>
      </header>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem" }}>
        <section className="glass-panel" style={{ padding: "2.5rem", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🏟️</div>
          <h2 style={{ marginBottom: "1rem", fontSize: "1.8rem" }}>Fan Portal</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem", flexGrow: 1, lineHeight: 1.5 }}>
            Multilingual AI assistant for real-time navigation, food wait times, and personalized accessibility routes.
          </p>
          <Link href="/fan-hub" className="btn-primary" style={{ width: "100%", textAlign: "center", textDecoration: "none", boxSizing: "border-box" }}>Enter Fan Hub</Link>
        </section>
        
        <section className="glass-panel" style={{ padding: "2.5rem", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚡</div>
          <h2 style={{ marginBottom: "1rem", fontSize: "1.8rem" }}>Command Center</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem", flexGrow: 1, lineHeight: 1.5 }}>
            Operational intelligence for staff. Crowd density heatmaps, real-time incident reporting, and predictive sustainability.
          </p>
          <Link href="/staff" className="btn-primary" style={{ width: "100%", textAlign: "center", textDecoration: "none", boxSizing: "border-box" }}>Staff Dashboard</Link>
        </section>
      </div>
    </main>
  );
}
