import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false)
  const [isSupportDropdownOpen, setIsSupportDropdownOpen] = useState(false)
  const productsDropdownRef = useRef(null)
  const supportDropdownRef = useRef(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    setIsProductsDropdownOpen(false)
    setIsSupportDropdownOpen(false)
  }

  const toggleProductsDropdown = () => {
    setIsProductsDropdownOpen(!isProductsDropdownOpen)
    setIsSupportDropdownOpen(false) // Close support dropdown when opening products
  }

  const toggleSupportDropdown = () => {
    setIsSupportDropdownOpen(!isSupportDropdownOpen)
    setIsProductsDropdownOpen(false) // Close products dropdown when opening support
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productsDropdownRef.current && !productsDropdownRef.current.contains(event.target)) {
        setIsProductsDropdownOpen(false)
      }
      if (supportDropdownRef.current && !supportDropdownRef.current.contains(event.target)) {
        setIsSupportDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img src="/Group 2 (1).png" alt="Orion Logo" className="nav-logo-img" />
          Orion
        </Link>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {/* Products Dropdown */}
          <li className="dropdown-container" ref={productsDropdownRef}>
            <button 
              className="dropdown-trigger" 
              onClick={toggleProductsDropdown}
            >
              Products <span className="dropdown-arrow">{isProductsDropdownOpen ? '▲' : '▼'}</span>
            </button>
            {isProductsDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/resume" onClick={closeMenu} className="dropdown-item">
                  Smart Rewrite
                </Link>
                <Link to="/cater" onClick={closeMenu} className="dropdown-item">
                  Cater
                </Link>
                <Link to="/jobfit" onClick={closeMenu} className="dropdown-item">
                  Job Fit
                </Link>
              </div>
            )}
          </li>

          <li><Link to="/pricing" onClick={closeMenu}>Pricing</Link></li>

          {/* Support Dropdown */}
          <li className="dropdown-container" ref={supportDropdownRef}>
            <button 
              className="dropdown-trigger" 
              onClick={toggleSupportDropdown}
            >
              Support <span className="dropdown-arrow">{isSupportDropdownOpen ? '▲' : '▼'}</span>
            </button>
            {isSupportDropdownOpen && (
              <div className="dropdown-menu">
                <a href="#" onClick={closeMenu} className="dropdown-item">
                  FAQ
                </a>
                <a href="#" onClick={closeMenu} className="dropdown-item">
                  Docs
                </a>
              </div>
            )}
          </li>
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
