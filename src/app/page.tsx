import Link from "next/link";

export default function Home() {
  return (
    <main className="landing-main">
      <header className="landing-header">
        <h1 className="landing-title">
          Welcome to <br/><span className="gradient-text">FIFA Nexus AI</span>
        </h1>
        <p className="landing-subtitle">
          The ultra-premium GenAI-enabled stadium operations and tournament experience hub for the FIFA World Cup 2026.
        </p>
      </header>
      
      <div className="landing-grid">
        <section className="glass-panel landing-card">
          <div className="card-icon">🏟️</div>
          <h2 className="card-title">Fan Portal</h2>
          <p className="card-desc">
            Multilingual AI assistant for real-time navigation, food wait times, and personalized accessibility routes.
          </p>
          <Link href="/fan-hub" className="btn-primary card-btn">Enter Fan Hub</Link>
        </section>
        
        <section className="glass-panel landing-card">
          <div className="card-icon">⚡</div>
          <h2 className="card-title">Command Center</h2>
          <p className="card-desc">
            Operational intelligence for staff. Crowd density heatmaps, real-time incident reporting, and predictive sustainability.
          </p>
          <Link href="/staff" className="btn-primary card-btn">Staff Dashboard</Link>
        </section>
      </div>
    </main>
  );
}
