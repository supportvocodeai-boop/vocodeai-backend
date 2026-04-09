import React from "react";
import "../styles/landing.css";

const Landing = () => {
  return (
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
  );
};

export default Landing;