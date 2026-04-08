import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/landing.css";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Landing() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    activeUsers: 0,
    totalUsers: 0,
    projectsCreated: 0,
    uptime: 0,
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  /* ================= FETCH STATS ================= */

  useEffect(() => {
    const loadStats = () => {
      fetch(`${backendUrl}/api/stats`)
        .then((res) => {
          if (!res.ok) throw new Error("Stats fetch failed");
          return res.json();
        })
        .then((data) => {
          setStats({
            activeUsers: data.activeUsers || 0,
            totalUsers: data.totalUsers || 0,
            projectsCreated: data.projectsCreated || 0,
            uptime: data.uptime || 0,
          });
        })
        .catch((err) => {
          console.error("Stats error:", err.message);
        });
    };

    loadStats();

    // Auto refresh every 30 sec
    const interval = setInterval(loadStats, 30000);

    return () => clearInterval(interval);
  }, []);

  /* ================= FORMAT UPTIME ================= */

  const formatUptime = (seconds) => {
    if (!seconds) return "0h 0m";

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) {
      return `${days}d ${hours}h`;
    }

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="landing">
      {/* NAVBAR */}
      <nav className="landing-nav">
        <img src="/Nlogo.png" alt="CodeWhisper" />
        <button
          className="primary-btn"
          onClick={() => navigate("/login")}
        >
          Enter CodeWhisper
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <h1>
          The <span>AI Workspace</span><br />
          Built for Modern Developers
        </h1>

        <p>
          CodeWhisper is a cloud-native AI coding environment where developers
          think, build, run, and scale software — without friction.
        </p>

        <button
          className="primary-btn large"
          onClick={() => navigate("/login")}
        >
          Start Your Journey
        </button>
      </section>

      {/* STATS */}
      {/* STATS */}
<section className="stats">

  <div className="stats-header">
    <span className="live-indicator"></span>
    <p className="live-text">Live Platform Metrics</p>
  </div>

  <div className="stat">
    <h3>{stats.activeUsers}</h3>
    <p>Active Developers</p>
  </div>

  <div className="stat">
    <h3>{stats.totalUsers}</h3>
    <p>Total Users</p>
  </div>

  <div className="stat">
    <h3>{stats.projectsCreated}</h3>
    <p>Projects Created</p>
  </div>

  <div className="stat">
    <h3>{formatUptime(stats.uptime)}</h3>
    <p>Platform Uptime</p>
  </div>

</section>

      {/* VISION */}
      <section className="vision">
        <h2>Our Vision</h2>
        <p>
          We believe the future of software development is a collaboration
          between human creativity and artificial intelligence. CodeWhisper
          empowers developers to focus on ideas — while AI handles execution.
        </p>
      </section>

      {/* USE CASES */}
      <section className="use-cases">
        <h2>Who Is CodeWhisper For?</h2>

        <div className="use-grid">
          <div className="use-card">
            <span>🎓</span>
            <h3>Students</h3>
            <p>Learn faster with AI guidance and live execution.</p>
          </div>

          <div className="use-card">
            <span>👨‍💻</span>
            <h3>Developers</h3>
            <p>Build real-world applications with AI-assisted workflows.</p>
          </div>

          <div className="use-card">
            <span>🚀</span>
            <h3>Startups</h3>
            <p>Prototype and scale without infrastructure overhead.</p>
          </div>

          <div className="use-card">
            <span>🏫</span>
            <h3>Educators</h3>
            <p>Teach programming interactively with real execution.</p>
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="difference">
        <h2>What Makes CodeWhisper Different?</h2>

        <div className="difference-grid">
          <div className="difference-card">
            <span>🧠</span>
            <h3>AI-Native Core</h3>
            <p>Designed from day one for AI-driven development.</p>
          </div>

          <div className="difference-card">
            <span>☁️</span>
            <h3>Zero Setup</h3>
            <p>Run code instantly without local configuration.</p>
          </div>

          <div className="difference-card">
            <span>🎙️</span>
            <h3>Voice to Code</h3>
            <p>Convert ideas into code using natural speech.</p>
          </div>

          <div className="difference-card">
            <span>📁</span>
            <h3>Persistent Workspaces</h3>
            <p>Your projects live securely in the cloud.</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="final-cta-inner">
          <p className="final-eyebrow">
            Built for the next generation of developers
          </p>

          <h2 className="final-title">
            Code with <span>Intelligence</span>,<br />
            not overhead.
          </h2>

          <p className="final-subtitle">
            CodeWhisper removes setup, friction, and guesswork — so you can focus
            on building real software with AI at your side.
          </p>

          <div className="final-actions">
            <button
              className="final-primary"
              onClick={() => navigate("/login")}
            >
              Enter CodeWhisper
            </button>
          </div>

          <div className="final-trust">
            Trusted by developers, students, and teams worldwide
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
  <div className="footer-container">

    {/* Brand */}
    <div>
      <h3>CodeWhisper</h3>
      <p>
        A cloud-native AI workspace built for modern developers.
        Think, build, and scale — without friction.
      </p>
    </div>

    {/* Contact */}
    <div>
      <h3>Contact</h3>
      <a href="mailto:support@codewhisper.ai">
        📧 codewhisper.ai@gmail.com
      </a>
      <a href="tel:+919999999999">
        📞 +91 98977 87403
      </a>
    </div>

    {/* Social */}
    <div>
      <h3>Connect With Us</h3>
      <a 
        href="https://www.instagram.com/codewhisper.ai" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <FaInstagram />
      </a>
      <a 
        href="https://linkedin.com/" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <FaLinkedin /> 
      </a>
    </div>

    {/* Product */}
    <div>
      <h3>Product</h3>
      <a href="#">Features</a>
      <a href="#">Documentation</a>
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
    </div>

  </div>

  <div className="footer-bottom">
    © 2026 CodeWhisper AI — Built with intelligence.
  </div>
</footer>
    </div>
  );
}
