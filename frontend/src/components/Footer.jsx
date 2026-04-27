import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Footer.css';

function Footer() {
  const { isAdmin, isAuthenticated } = useAuth();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-heading">💡Carri-Okay</h3>
          <p className="footer-description">
            Your trusted partner in career guidance and professional development.
          </p>
        </div>
        <div className="footer-section">
          <h4 className="footer-title">🔗Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            {isAdmin ? (
              <li><Link to="/admin">Admin Dashboard</Link></li>
            ) : (
              <>
                <li><Link to="/career-paths">Career Paths</Link></li>
                <li><Link to="/career-quiz">Career Quiz</Link></li>
                <li><Link to="/counseling">Counseling</Link></li>
                <li><Link to="/resources">Resources</Link></li>
                {isAuthenticated && <li><Link to="/dashboard">Dashboard</Link></li>}
              </>
            )}
          </ul>
        </div>
        <div className="footer-section">
          <h4 className="footer-title">📚Resources</h4>
          <ul className="footer-links">
            {isAdmin ? (
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/admin">Admin Dashboard</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/career-paths">Explore Careers</Link></li>
                <li><Link to="/career-comparison">Compare Careers</Link></li>
                <li><Link to="/counseling">Book Session</Link></li>
                <li><Link to="/resources">Resource Library</Link></li>
              </>
            )}
          </ul>
        </div>
        <div className="footer-section">
          <h4 className="footer-title">☎️Contact</h4>
          <ul className="footer-links">
            <li>📧Email: amar.sork@gmail.com</li>
            <li>📱Phone: +91-6202295XXX</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 1947 Carri-Okay. All rights reserved to Amar</p>
      </div>
    </footer>
  );
}

export default Footer;

