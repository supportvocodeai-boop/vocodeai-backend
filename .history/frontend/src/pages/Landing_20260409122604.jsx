import React from "react";
import "../styles/landing.css";
import { useEffect, useState } from "react";

const Landing = () => {
  const codeLines = [
    "function fibonacci(n) {",
    "  if (n <= 1) return n;",
    "  return fibonacci(n-1) + fibonacci(n-2);",
    "}"
  ];

   const [displayedLines, setDisplayedLines] = useState([]);

    useEffect(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedLines((prev) => [...prev, codeLines[i]]);
        i++;
        if (i === codeLines.length) clearInterval(interval);
      }, 600); // speed of typing

      return () => clearInterval(interval);
    }, []);

  return (
    <div>
    <nav className="navbar">
      <div className="navbar-inner">

        {/* LEFT: Logo */}
        <div className="logo">
          <span className="icon">&lt;/&gt;</span>
          <span className="text">VocodeAI</span>
        </div>

        {/* RIGHT: Links + Button */}
        <div className="right-group">
          <ul className="links">
            <li>Features</li>
            <li>Use Cases</li>
            <li>Pricing</li>
            <li>Docs</li>
          </ul>

          <button className="btn">Enter VocodeAI</button>
        </div>

      </div>
    </nav>
    <section className="hero">

      {/* LEFT */}
      <div className="hero-left">
        <div className="badge">🚀 AI-Powered Coding Platform</div>

        <h1>
          Build, Code, and <br />
          Execute with AI —
          <span className="highlight"> All in One Workspace</span>
        </h1>

        <p>
          A futuristic AI workspace with smart coding, voice commands,
          and cloud execution.
        </p>

        <div className="buttons">
          <button className="primary">Get Started</button>
          <button className="secondary">View Demo</button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hero-right">

        {/* Code Editor */}
        <div className="code-box">
          <div className="code-header">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
            <span className="file">main.js</span>
          </div>

          <div className="code-content">
            {displayedLines.map((line, index) => (
              <div key={index} className="code-line">
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Terminal */}
        <div className="terminal">
          <p>$ node main.js</p>
          <p className="running">Running...</p>
          <p className="success">✓ Executed successfully</p>
        </div>

        {/* AI Assistant */}
        <div className="assistant">
          <strong>✨ AI Assistant</strong>
          <p>I optimized your code for better performance!</p>
        </div>

      </div>
    </section>
    </div>
  );
};

export default Landing;