import React from 'react'
import "../styles/landing.css";
const Landing = () => {
  return (
    <div>
      <nav className="navbar">
        {/* LEFT: LOGO */}
        <div className="navbar-left">
          <span className="logo-icon">&lt;/&gt;</span>
          <span className="logo-text">VocodeAI</span>
        </div>

        {/* RIGHT: LINKS + BUTTON */}
        <div className="navbar-right">
          <ul className="nav-links">
            <li>Features</li>
            <li>Use Cases</li>
            <li>Pricing</li>
            <li>Docs</li>
          </ul>

          <button className="nav-btn">Enter VocodeAI</button>
        </div>
      </nav>

      <section className="hero">

      {/* LEFT SIDE */}
      <div className="hero-left">
        
        <div className="badge">
          🚀 AI-Powered Coding Platform
        </div>

        <h1 className="hero-title">
          Build, Code, and <br />
          Execute with AI — <br />
          All in One Workspace
        </h1>

        <p className="hero-desc">
          VocodeAI combines a smart code editor, AI assistant, and
          cloud terminal into one seamless developer experience.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">
            Get Started →
          </button>

          <button className="secondary-btn">
            ▶ View Demo
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hero-right">
        <div className="image-card">
          <img
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c"
            alt="code"
          />

          <div className="terminal-box">
            <p className="active">● AI Assistant Active</p>
            <p>$ Optimizing your code...</p>
          </div>
        </div>
      </div>

    </section>
    </div>
  )
}

export default Landing
