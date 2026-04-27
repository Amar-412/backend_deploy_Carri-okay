import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useComparison } from '../contexts/ComparisonContext';
import Card from '../components/Card';
import ProtectedBlur from '../components/ProtectedBlur';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import './CareerPaths.css';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;

const getUserId = (user) => user?.id ?? user?.userId ?? user?.uid ?? null;

const normalizeStringArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const getSavedCareerId = (item) =>
  item?.careerId ?? item?.id ?? item?.career?.id ?? null;

function CareerPaths() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [careers, setCareers] = useState([]);
  const [savedCareerIds, setSavedCareerIds] = useState(new Set());
  const { currentUser, token, logout } = useAuth();
  const { addToCompare, isInCompare, removeFromCompare, compareCareers } = useComparison();
  const currentUserId = getUserId(currentUser);

  useEffect(() => {
    fetchWithAuth(`${API_BASE}/careers`, {}, token)
      .then(res => {
        if (res.status === 401) {
          logout();
          throw new Error('Unauthorized');
        }
        if (!res.ok) {
          throw new Error('Failed to fetch careers');
        }
        return res.json();
      })
      .then(data => setCareers(Array.isArray(data) ? data : []))
      .catch(() => setCareers([]));
  }, [token, logout]);

  useEffect(() => {
    if (!currentUserId) return;

    fetchWithAuth(`${API_BASE}/saved-careers`, {}, token)
      .then(res => {
        if (res.status === 401) {
          logout();
          throw new Error('Unauthorized');
        }
        if (!res.ok) {
          throw new Error('Failed to fetch saved careers');
        }
        return res.json();
      })
      .then(data => {
        const ids = new Set(
          (Array.isArray(data) ? data : [])
            .map(getSavedCareerId)
            .filter((id) => id != null)
        );
        setSavedCareerIds(ids);
      })
      .catch(err => console.error(err));
  }, [currentUserId, token, logout]);

  const isSaved = (id) => savedCareerIds.has(id);

  const toggleSaved = async (careerId) => {
    if (!currentUserId) {
      alert("Please login to save careers");
      return;
    }

    try {
      if (isSaved(careerId)) {
        const res = await fetchWithAuth(
          `${API_BASE}/saved-careers/${careerId}`,
          { method: 'DELETE' },
          token
        );

        if (res.status === 401) {
          logout();
          return;
        }

        if (!res.ok) throw new Error();

        setSavedCareerIds(prev => {
          const updated = new Set(prev);
          updated.delete(careerId);
          return updated;
        });
      } else {
        const res = await fetchWithAuth(
          `${API_BASE}/saved-careers/${careerId}`,
          { method: 'POST' },
          token
        );

        if (res.status === 401) {
          logout();
          return;
        }

        if (!res.ok) throw new Error();

        setSavedCareerIds(prev => {
          const updated = new Set(prev);
          updated.add(careerId);
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['All', ...new Set((careers || []).map(c => c.category))];

  const filteredCareers = careers.filter(career => {
    const matchesSearch = career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         career.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || career.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ProtectedBlur>
    <div className="career-paths-page">
      <div className="container">
        <section className="career-paths-header">
          <h1 className="page-title">Explore Career Paths</h1>
          <p className="page-subtitle">Discover opportunities that align with your interests and skills</p>
          {compareCareers.length > 0 && (
            <Link to="/career-comparison" className="btn btn-primary compare-cta">
              Compare Selected ({compareCareers.length})
            </Link>
          )}
        </section>

        <section className="filters-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search careers..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="careers-section">
          <div className="careers-grid">
            {filteredCareers.map(career => (
              <Card key={career.id} className="career-path-card">
                <div className="career-path-header">
                  <h3 className="career-path-title">
                    <Link to={`/career-paths/${career.id}`}>{career.title}</Link>
                  </h3>
                  <div className="career-card-actions">
                    <button
                      className={`icon-btn-sm bookmark-btn ${isSaved(career.id) ? 'saved' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleSaved(career.id); }}
                      title={isSaved(career.id) ? 'Remove from saved' : 'Save career'}
                      aria-label="Bookmark"
                    >
                      {isSaved(career.id) ? '★' : '☆'}
                    </button>
                    <button
                      className={`icon-btn-sm compare-btn ${isInCompare(career.id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        isInCompare(career.id) ? removeFromCompare(career.id) : addToCompare(career);
                      }}
                      title="Compare"
                      aria-label="Compare"
                    >
                      ⇔
                    </button>
                  </div>
                </div>
                <span className="career-path-category">{career.category}</span>
                <p className="career-path-description">{career.description}</p>
                <div className="career-path-skills">
                  <h4 className="skills-heading">Required Skills:</h4>
                  <div className="skills-list">
                    {normalizeStringArray(career.requiredSkills).map((skill, idx) => (
                      <span key={idx} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                </div>
                <Link to={`/career-paths/${career.id}`} className="btn btn-outline career-view-btn">
                  View Details
                </Link>
              </Card>
            ))}
          </div>
          {filteredCareers.length === 0 && (
            <div className="no-results">
              <p>No careers found matching your criteria.</p>
            </div>
          )}
        </section>
      </div>
    </div>
    </ProtectedBlur>
  );
}

export default CareerPaths;
