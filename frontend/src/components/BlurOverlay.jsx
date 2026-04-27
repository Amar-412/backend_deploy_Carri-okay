import { useNavigate } from 'react-router-dom';
import './BlurOverlay.css';

export default function BlurOverlay() {
  const navigate = useNavigate();

  return (
    <div
      className="blur-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="blur-overlay-title"
    >
      <div className="blur-overlay-panel">
        <span className="blur-overlay-lock" aria-hidden="true">
          🔒
        </span>
        <p id="blur-overlay-title" className="blur-overlay-title">
          Login Required
        </p>
        <button
          type="button"
          className="blur-overlay-btn"
          onClick={() => navigate('/login')}
        >
          Log in
        </button>
      </div>
    </div>
  );
}
