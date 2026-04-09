import React, { useEffect, useState } from "react";
import "../styles/landing.css";

const Landing = () => {
  /* ================= HERO CODE ================= */
  const [displayedLines, setDisplayedLines] = useState([]);

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
    }, 600);

    return () => clearInterval(interval);
  }, []);

  /* ================= FEATURES ================= */
  const [featureVisible, setFeatureVisible] = useState([]);

  useEffect(() => {
    [0, 300, 600, 900].forEach((delay, i) => {
      setTimeout(() => {
        setFeatureVisible((prev) => [...prev, i]);
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
      desc: "Syntax highlighting, auto-completion, and real-time collaboration.",
      icon: "</>",
    },
    {
      title: "Cloud Terminal",
      desc: "Execute commands and build projects in the cloud instantly.",
      icon: ">_",
    },
    {
      title: "Voice Control",
      desc: "Code using voice commands and hands-free control.",
      icon: "🎤",
    },
  ];

  /* ================= AUDIENCE ================= */
  const [audienceVisible, setAudienceVisible] = useState([]);

  useEffect(() => {
    [0, 300, 600, 900].forEach((delay, i) => {
      setTimeout(() => {
        setAudienceVisible((prev) => [...prev, i]);
      }, delay);
    });
  }, []);

  const audience = [
    { title: "Students", desc: "Learn coding with AI", icon: "🎓" },
    { title: "Developers", desc: "Build faster", icon: "</>" },
    { title: "Teams", desc: "Collaborate", icon: "👥" },
    { title: "Hackathons", desc: "Ship MVPs", icon: "🏆" },
  ];

  /* ================= POSSIBILITIES ================= */
  const [possVisible, setPossVisible] = useState([]);

  useEffect(() => {
    [0, 300, 600, 900].forEach((delay, i) => {
      setTimeout(() => {
        setPossVisible((prev) => [...prev, i]);
      }, delay);
    });
  }, []);

  const possibilities = [
    { title: "Rapid Prototyping", desc: "Build ideas fast", icon: "⚡" },
    { title: "Learning Coding", desc: "Interactive tutorials", icon: "📘" },
    { title: "AI Development", desc: "Train AI models", icon: "🧠" },
    { title: "Remote Coding", desc: "Work anywhere", icon: "☁️" },
  ];

  /* ================= HOW IT WORKS (FIXED) ================= */
  const [stepVisible, setStepVisible] = useState([]);

  useEffect(() => {
    [0, 300, 600].forEach((delay, i) => {
      setTimeout(() => {
        setStepVisible((prev) => [...prev, i]);
      }, delay);
    });
  }, []);

  const steps = [
    {
      number: "1",
      title: "Create Workspace",
      desc: "Set up your coding environment in seconds",
      icon: "📁",
    },
    {
      number: "2",
      title: "Write or Speak Code",
      desc: "Type naturally or use voice commands",
      icon: "💬",
    },
    {
      number: "3",
      title: "Run & Build Instantly",
      desc: "Execute and deploy with one click",
      icon: "🚀",
    },
  ];

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="logo">
            <span className="icon">&lt;/&gt;</span>
            <span className="text">VocodeAI</span>
          </div>

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

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <h1>
            Build, Code, Execute —
            <span> All in One Workspace</span>
          </h1>
        </div>

        <div className="hero-right">
          <div className="code-box">
            <div className="code-content">
              {displayedLines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="features-grid">
          {features.map((f, i) => (
            <div className={`card ${featureVisible.includes(i) ? "show" : ""}`} key={i}>
              <div>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="audience">
        <div className="audience-grid">
          {audience.map((a, i) => (
            <div className={`card ${audienceVisible.includes(i) ? "show" : ""}`} key={i}>
              <div>{a.icon}</div>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POSSIBILITIES */}
      <section className="possibilities">
        <div className="poss-grid">
          {possibilities.map((p, i) => (
            <div className={`card ${possVisible.includes(i) ? "show" : ""}`} key={i}>
              <div>{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS (FIXED) */}
      <section className="how">
        <div className="how-header">
          <h2>How It Works</h2>
          <p>Get started in three simple steps</p>
        </div>

        <div className="line"></div>

        <div className="steps">
          {steps.map((step, i) => (
            <div className={`step ${stepVisible.includes(i) ? "show" : ""}`} key={i}>
              <div className="circle">{step.number}</div>

              <div className="card">
                <div>{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;