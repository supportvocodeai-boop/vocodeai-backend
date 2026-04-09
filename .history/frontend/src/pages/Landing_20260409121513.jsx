import React from 'react'
import '../styles/landing.css';

const Landing = () => {
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-container">
          
          {/* Left Section (Logo) */}
          <div className="navbar-left">
            <span className="logo-icon">&lt;/&gt;</span>
            <span className="logo-text">VocodeAI</span>
          </div>

          {/* Right Section */}
          <div className="navbar-right">
            <ul className="nav-links">
              <li>Features</li>
              <li>Use Cases</li>
              <li>Pricing</li>
              <li>Docs</li>
            </ul>

            <button className="cta-btn">Enter VocodeAI</button>
          </div>

        </div>
      </nav>
    </div>
  )
}

export default Landing
