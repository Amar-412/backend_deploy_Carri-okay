import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./UserDrawer.css";

function UserDrawer({ isOpen, onClose, onEditProfile }) {
  const { logout, currentUser } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
    window.location.href = '/';
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className={`user-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3 className="drawer-title">Menu</h3>
          <button className="drawer-close" onClick={onClose} aria-label="Close menu">
            ×
          </button>
        </div>
        <nav className="drawer-nav">
          <button
            className="drawer-item"
            onClick={() => {
              onEditProfile();
              onClose();
            }}
          >
            <span className="drawer-icon">🖼️</span>
            <span>Edit Profile Pic</span>
          </button>
          <Link to="/career-quiz" className="drawer-item" onClick={onClose}>
            <span className="drawer-icon">📋</span>
            <span>Take Career Quiz</span>
          </Link>
          <Link to="/resources" className="drawer-item" onClick={onClose}>
            <span className="drawer-icon">📚</span>
            <span>Resources</span>
          </Link>
          {currentUser && (
            <div className="drawer-user-info">
              <p className="drawer-user-name">{currentUser.name}</p>
              <p className="drawer-user-email">{currentUser.email}</p>
            </div>
          )}
          
          <button className="drawer-item drawer-logout" onClick={handleLogout}>
            <span className="drawer-icon">🚪</span>
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
}

export default UserDrawer;
