import { useAuth } from '../contexts/AuthContext';
import BlurOverlay from './BlurOverlay';
import './ProtectedBlur.css';

export default function ProtectedBlur({ children }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="protected-blur-root">
      <div className={!isAuthenticated ? 'protected-blur-locked' : undefined}>
        {children}
      </div>
      {!isAuthenticated && <BlurOverlay />}
    </div>
  );
}
