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
    </div>
  )
}

export default Landing
