import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import UserDrawer from './UserDrawer';
import ProfileModal from './ProfileModal';
import './Navbar.css';

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, isAdmin, currentUser } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [mobileMenuOpen]);

  const mobileNavContent = (
    <>
      <Link to="/" className="navbar-mobile-link" onClick={closeMobileMenu}>Home</Link>
      {!isAdmin && (
        <>
          <Link to="/career-paths" className="navbar-mobile-link" onClick={closeMobileMenu}>Career Paths</Link>
          <Link to="/career-quiz" className="navbar-mobile-link" onClick={closeMobileMenu}>Career Quiz</Link>
          <Link to="/counseling" className="navbar-mobile-link" onClick={closeMobileMenu}>Counseling</Link>
          <Link to="/resources" className="navbar-mobile-link" onClick={closeMobileMenu}>Resources</Link>
        </>
      )}
      {isAuthenticated && !isAdmin && (
        <Link to="/dashboard" className="navbar-mobile-link" onClick={closeMobileMenu}>Dashboard</Link>
      )}
      {isAdmin && (
        <Link to="/admin" className="navbar-mobile-link" onClick={closeMobileMenu}>Admin Dashboard</Link>
      )}
      {isAuthenticated ? (
        <button
          type="button"
          className="navbar-mobile-link navbar-mobile-avatar-btn"
          onClick={() => { setDrawerOpen(true); closeMobileMenu(); }}
        >
          Account ({getInitials(currentUser?.name)})
        </button>
      ) : (
        <Link to="/auth" className="navbar-mobile-link" onClick={closeMobileMenu}>Login / Register</Link>
      )}
      <button
        type="button"
        className="navbar-mobile-link navbar-mobile-theme-btn"
        onClick={() => { toggleTheme(); closeMobileMenu(); }}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? '🌙 Dark mode' : '☀️ Light mode'}
      </button>
    </>
  );

  return (
    <>
      <div className={`navbar-wrapper ${mobileMenuOpen ? 'navbar-mobile-open' : ''}`}>
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/" className="navbar-logo">
              <img src="/images/logo.png" alt="Carri-Okay Logo" className="logo-img" />
               <span className="logo-text">Carri-Okay</span>
            </Link>

            <ul className="navbar-menu">
              <li><Link to="/" className="navbar-link">Home</Link></li>
              {!isAdmin && (
                <>
                  <li><Link to="/career-paths" className="navbar-link">Career Paths</Link></li>
                  <li><Link to="/career-quiz" className="navbar-link">Career Quiz</Link></li>
                  <li><Link to="/counseling" className="navbar-link">Counseling</Link></li>
                  <li><Link to="/resources" className="navbar-link">Resources</Link></li>
                </>
              )}
              {isAuthenticated && !isAdmin && (
                <li><Link to="/dashboard" className="navbar-link">Dashboard</Link></li>
              )}
              {isAdmin && (
                <li><Link to="/admin" className="navbar-link">Admin Dashboard</Link></li>
              )}
              {isAuthenticated ? (
                <li className="navbar-avatar-container">
                  <button
                    className="user-avatar"
                    onClick={() => setDrawerOpen(true)}
                    aria-label="User menu"
                  >
                    {currentUser?.profileImage ? (
                      <img
                        src={`http://localhost:8080${currentUser.profileImage}`}
                        alt={`${currentUser?.name || "User"} avatar`}
                        className="avatar-img"
                      />
                    ) : (
                      getInitials(currentUser?.name)
                    )}
                  </button>
                </li>
              ) : (
                <li>
                  <Link to="/auth" className="navbar-link navbar-auth-btn">Login / Register</Link>
                </li>
              )}
              <li>
                <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
              </li>
            </ul>

            <button
              type="button"
              className="navbar-hamburger"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="navbar-hamburger-bar" />
              <span className="navbar-hamburger-bar" />
              <span className="navbar-hamburger-bar" />
            </button>
          </div>
        </nav>

        <div
          className="navbar-mobile-overlay"
          onClick={closeMobileMenu}
          role="button"
          tabIndex={-1}
          aria-label="Close menu"
        />
        <div className="navbar-mobile-drawer" aria-hidden={!mobileMenuOpen}>
          <button
            type="button"
            className="navbar-mobile-close"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            ×
          </button>
          <nav className="navbar-mobile-nav">
            {mobileNavContent}
          </nav>
        </div>
      </div>

      {isAuthenticated && (
        <>
          <UserDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onEditProfile={() => setProfileOpen(true)}
          />
          <ProfileModal
            isOpen={profileOpen}
            onClose={() => setProfileOpen(false)}
          />
        </>
      )}
    </>
  );
}

export default Navbar;