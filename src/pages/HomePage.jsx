import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/home.css";

const STATS = [
  { value: "₹2.4Cr+", label: "Raised" },
  { value: "1,200+", label: "Campaigns" },
  { value: "18,000+", label: "Donors" },
  { value: "94%", label: "Success Rate" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create a Campaign",
    desc: "Register and submit your campaign with a goal, story, and target amount.",
  },
  {
    step: "02",
    title: "Admin Reviews",
    desc: "Our team reviews and approves campaigns to ensure quality and trust.",
  },
  {
    step: "03",
    title: "Receive Donations",
    desc: "Approved campaigns go live. Donors can discover and fund your cause.",
  },
  {
    step: "04",
    title: "Secure Payment",
    desc: "Powered by Razorpay with webhook-based verification for full financial integrity.",
  },
];

export default function HomePage() {
  return (
    <div className="page home-page">
      <Navbar />
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content fade-up">
          <div className="hero-badge">Trusted crowdfunding platform</div>
          <h1 className="hero-title">
            Fund causes that <br />
            <em>matter to you</em>
          </h1>
          <p className="hero-subtitle">
            A verified, admin-moderated crowdfunding platform powered by secure
            Razorpay payments. Every campaign is reviewed before going live.
          </p>
          <div className="hero-actions">
            <Link to="/auth?tab=register" className="btn btn-primary btn-lg">
              Start a Campaign
            </Link>
            <Link to="/auth" className="btn btn-outline btn-lg">
              Browse Campaigns
            </Link>
          </div>
        </div>
        <div className="hero-visual fade-in">
          <div className="hero-card">
            <div style={{ fontSize: 36 }}>🌱</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--text)", marginTop: 12 }}>
              Reforestation Drive 2025
            </div>
            <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>
              by Priya Sharma
            </div>
            <div style={{ marginTop: 16 }}>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: "72%" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 13 }}>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>₹3,60,000</span>
                <span style={{ color: "var(--text3)" }}>of ₹5,00,000</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <span className="badge badge-approved">Approved</span>
              <span className="badge" style={{ background: "var(--accent-dim2)", color: "var(--text2)", border: "1px solid var(--border)" }}>
                Environment
              </span>
            </div>
          </div>
          <div className="hero-card-mini">
            <span>💡</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Solar Power for Schools</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>48% funded</div>
            </div>
          </div>
          <div className="hero-card-mini" style={{ animationDelay: "0.2s" }}>
            <span>❤️</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Free Medical Camp</div>
              <div style={{ fontSize: 12, color: "var(--success)" }}>Goal reached!</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="page-content">
          <div className="stat-grid">
            {STATS.map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="hiw-section">
        <div className="page-content">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className="section-title">How it works</h2>
            <p className="section-subtitle">From idea to funded — a simple, verified process</p>
          </div>
          <div className="hiw-grid">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="hiw-card">
                <div className="hiw-step">{item.step}</div>
                <h3 className="hiw-title">{item.title}</h3>
                <p className="hiw-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="page-content" style={{ textAlign: "center" }}>
          <h2 className="section-title" style={{ fontSize: 36, marginBottom: 16 }}>
            Ready to make an impact?
          </h2>
          <p className="section-subtitle" style={{ marginBottom: 32, fontSize: 16 }}>
            Join thousands of changemakers on FundForge
          </p>
          <Link to="/auth?tab=register" className="btn btn-primary btn-lg">
            Create Free Account
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div style={{ color: "var(--text3)", fontSize: 13 }}>
          © 2025 FundForge. Built with Spring Boot + React + Razorpay
        </div>
      </footer>
    </div>
  );
}
