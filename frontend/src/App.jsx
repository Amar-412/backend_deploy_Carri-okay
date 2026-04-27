import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { SavedCareersProvider } from './contexts/SavedCareersContext';
import { ComparisonProvider } from './contexts/ComparisonContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Auth from "./pages/Auth";
import UserDashboard from './pages/UserDashboard';
import CareerPaths from './pages/CareerPaths';
import CareerDetail from './pages/CareerDetail';
import CareerQuiz from './pages/CareerQuiz';
import CareerComparison from './pages/CareerComparison';
import Counseling from './pages/Counseling';
import ResourceLibrary from './pages/ResourceLibrary';
import AdminDashboard from './pages/AdminDashboard';
import VideoBackground from './components/VideoBackground';
import './App.css';
import './styles/global.css';

function AppShell() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="app">
      {isHome && <VideoBackground src="/video/background.mp4" />}
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/career-paths"
            element={
              <ProtectedRoute userOnly>
                <CareerPaths />
              </ProtectedRoute>
            }
          />
          <Route
            path="/career-paths/:id"
            element={
              <ProtectedRoute userOnly>
                <CareerDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/career-quiz"
            element={
              <ProtectedRoute userOnly>
                <CareerQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/career-comparison"
            element={
              <ProtectedRoute userOnly>
                <CareerComparison />
              </ProtectedRoute>
            }
          />
          <Route
            path="/counseling"
            element={
              <ProtectedRoute userOnly>
                <Counseling />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute userOnly>
                <ResourceLibrary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SavedCareersProvider>
          <ComparisonProvider>
            <Router>
              <AppShell />
            </Router>
          </ComparisonProvider>
        </SavedCareersProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
