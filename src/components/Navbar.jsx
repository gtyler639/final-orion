import { useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img src="/Group 2 (1).png" alt="Orion Logo" className="nav-logo-img" />
          Orion
        </Link>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/jobfit" onClick={closeMenu}>Job Fit</Link></li>
          <li><Link to="/cater" onClick={closeMenu}>Cater</Link></li>
          <li><Link to="/resume" onClick={closeMenu}>Rewriter</Link></li>
        </ul>

        <div className={`nav-actions ${isMenuOpen ? 'active' : ''}`}>
          <a href="#" className="nav-login">Log in</a>
          <Link to="/signup" className="nav-signup" onClick={closeMenu}>Sign up</Link>
        </div>

        <button className="mobile-menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
