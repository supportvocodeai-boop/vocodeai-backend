import React, { useEffect, useState } from "react";
import "../styles/landing.css";
import { FaRobot, FaCode, FaTerminal, FaMicrophone } from "react-icons/fa";

const featuresData = [
  {
    icon: <FaRobot />,
    title: "AI Assistant",
    desc: "Generate, fix, and optimize code using AI",
  },
  {
    icon: <FaCode />,
    title: "Smart Code Editor",
    desc: "Write code with syntax highlighting and fast execution",
  },
  {
    icon: <FaTerminal />,
    title: "Cloud Terminal",
    desc: "Run code instantly in a powerful cloud environment",
  },
  {
    icon: <FaMicrophone />,
    title: "Voice Control",
    desc: "Control your coding workflow using voice commands",
  },
];
const Landing = () => {
   const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    featuresData.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, index]);
      }, index * 300); // delay between cards
    });
  }, []);

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
       <section className="features">
      <h2 className="features-title">Powerful Features</h2>
      <p className="features-subtitle">
        Everything you need to build, code, and ship faster
      </p>

      <div className="features-grid">
        {featuresData.map((feature, index) => (
          <div
            key={index}
            className={`feature-card ${
              visibleCards.includes(index) ? "show" : ""
            }`}
          >
            <div className="icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>

    </div>
  )
}

export default Landing
