import React from 'react'
import '../styles/landing.css';

const Landing = () => {
  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Left group (logo + links together) */}
        <div className="left-group">
          <div className="logo">
            <span className="icon">&lt;/&gt;</span>
            <span className="text">VocodeAI</span>
          </div>

          <ul className="links">
            <li>Features</li>
            <li>Use Cases</li>
            <li>Pricing</li>
            <li>Docs</li>
          </ul>
        </div>

        {/* Right button */}
        <button className="btn">Enter VocodeAI</button>

      </div>
    </nav>
  )
}

export default Landing
