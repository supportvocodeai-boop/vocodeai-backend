import React from "react";
import "../styles/landing.css";
import { useEffect, useState } from "react";

const Landing = () => {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [visible, setVisible] = useState([]);
  
  const codeLines = [
    "function fibonacci(n) {",
    "  if (n <= 1) return n;",
    "  return fibonacci(n-1) + fibonacci(n-2);",
    "}",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedLines((prev) => [...prev, codeLines[i]]);
      i++;
      if (i === codeLines.length) clearInterval(interval);
    }, 600); // speed of typing

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const delays = [0, 300, 600, 900];

    delays.forEach((delay, index) => {
      setTimeout(() => {
        setVisible((prev) => [...prev, index]);
      }, delay);
    });
  }, []);

  const features = [
    {
      title: "AI Assistant",
      desc: "Get intelligent code suggestions, debugging help, and instant answers powered by advanced AI.",
      icon: "🤖",
    },
    {
      title: "Smart Code Editor",
      desc: "Syntax highlighting, auto-completion, and real-time collaboration in a beautiful interface.",
      icon: "</>",
    },
    {
      title: "Cloud Terminal",
      desc: "Execute commands, run scripts, and build projects directly in the cloud with instant feedback.",
      icon: ">_",
    },
    {
      title: "Voice Control",
      desc: "Code with your voice. Dictate commands, write code, and control your workspace hands-free.",
      icon: "🎤",
    },
  ];

  useEffect(() => {
    const delays = [0, 300, 600, 900];

    delays.forEach((delay, index) => {
      setTimeout(() => {
        setVisible((prev) => [...prev, index]);
      }, delay);
    });
  }, []);

  const data = [
    {
      title: "Students",
      desc: "Learn coding with AI guidance",
      icon: "🎓",
    },
    {
      title: "Developers",
      desc: "Build projects faster with AI",
      icon: "</>",
    },
    {
      title: "Teams",
      desc: "Collaborate in real-time",
      icon: "👥",
    },
    {
      title: "Hackathon Builders",
      desc: "Ship MVPs in hours",
      icon: "🏆",
    },
  ];

   useEffect(() => {
    const delays = [0, 300, 600, 900];

    delays.forEach((delay, index) => {
      setTimeout(() => {
        setVisible((prev) => [...prev, index]);
      }, delay);
    });
  }, []);

  const items = [
    {
      title: "Rapid Prototyping",
      desc: "Build and test ideas in minutes with AI-assisted coding and instant deployment.",
      icon: "⚡",
    },
    {
      title: "Learning Coding",
      desc: "Interactive tutorials, AI explanations, and real-time feedback for beginners.",
      icon: "📘",
    },
    {
      title: "AI Development",
      desc: "Experiment with AI models, train algorithms, and integrate machine learning.",
      icon: "🧠",
    },
    {
      title: "Remote Coding",
      desc: "Access your workspace anywhere with cloud-based development environment.",
      icon: "☁️",
    },
  ];


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
            A futuristic AI workspace with smart coding, voice commands, and
            cloud execution.
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
      <section className="features">
        {/* Heading */}
        <div className="features-header">
          <h2>
            Powerful Features for <span>Modern Developers</span>
          </h2>
          <p>Everything you need to code faster and smarter</p>
        </div>

        {/* Cards */}
        <div className="features-grid">
          {features.map((item, index) => (
            <div
              key={index}
              className={`card ${visible.includes(index) ? "show" : ""}`}
            >
              <div className="icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="audience">

      {/* HEADER */}
      <div className="audience-header">
        <h2>Made For Everyone</h2>
        <p>From beginners to professionals</p>
      </div>

      {/* CARDS */}
      <div className="audience-grid">
        {data.map((item, index) => (
          <div
            key={index}
            className={`audience-card ${
              visible.includes(index) ? "show" : ""
            }`}
          >
            <div className="icon-circle">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>

    </section>
    <section className="possibilities">

      {/* HEADER */}
      <div className="poss-header">
        <h2>
          Endless <span>Possibilities</span>
        </h2>
        <p>See what you can build with VocodeAI</p>
      </div>

      {/* GRID */}
      <div className="poss-grid">
        {items.map((item, index) => (
          <div
            key={index}
            className={`poss-card ${
              visible.includes(index) ? "show" : ""
            }`}
          >
            <div className="icon-box">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>

    </section>
    <section className="how">

      {/* HEADER */}
      <div className="how-header">
        <h2>How It Works</h2>
        <p>Get started in three simple steps</p>
      </div>

      {/* LINE */}
      <div className="line"></div>

      {/* STEPS */}
      <div className="steps">

        {/* STEP 1 */}
        <div className="step">
          <div className="circle">1</div>

          <div className="card">
            <div className="icon">📁</div>
            <h3>Create Workspace</h3>
            <p>Set up your coding environment in seconds</p>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="step">
          <div className="circle">2</div>

          <div className="card">
            <div className="icon">💬</div>
            <h3>Write or Speak Code</h3>
            <p>Type naturally or use voice commands</p>
          </div>
        </div>

        {/* STEP 3 */}
        <div className="step">
          <div className="circle">3</div>

          <div className="card">
            <div className="icon">🚀</div>
            <h3>Run & Build Instantly</h3>
            <p>Execute and deploy with one click</p>
          </div>
        </div>

      </div>
    </section>
    </div>
  );
};

export default Landing;
