import { useState, useEffect } from 'react';
import Card from '../components/Card';
import ProtectedBlur from '../components/ProtectedBlur';
import { useAuth } from '../contexts/AuthContext';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import './ResourceLibrary.css';

const getUserId = (user) => user?.id ?? user?.userId ?? user?.uid ?? null;
const getSavedResourceId = (item) =>
  item?.resourceId ?? item?.id ?? item?.resource?.id ?? null;

function ResourceLibrary() {
  const [resources, setResources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [savedResourceIds, setSavedResourceIds] = useState(new Set());
  const { currentUser, token, logout } = useAuth();
  const currentUserId = getUserId(currentUser);

  // Fetch from backend
  useEffect(() => {
    fetchWithAuth('http://localhost:8080/api/resources', {}, token)
      .then(res => {
        if (res.status === 401) {
          logout();
          throw new Error('Unauthorized');
        }
        if (!res.ok) {
          throw new Error('Failed to fetch resources');
        }
        return res.json();
      })
      .then(data => setResources(data))
      .catch(err => console.error(err));
  }, [token, logout]);

  useEffect(() => {
    if (!currentUserId) return;

    fetchWithAuth('http://localhost:8080/api/saved-resources', {}, token)
      .then(res => {
        if (res.status === 401) {
          logout();
          throw new Error('Unauthorized');
        }
        if (!res.ok) {
          throw new Error('Failed to fetch saved resources');
        }
        return res.json();
      })
      .then(data => {
        const ids = new Set(
          (Array.isArray(data) ? data : [])
            .map(getSavedResourceId)
            .filter((id) => id != null)
        );
        setSavedResourceIds(ids);
      })
      .catch(err => console.error(err));
  }, [currentUserId, token, logout]);

  const isSaved = (id) => savedResourceIds.has(id);

  const toggleSaved = async (resourceId) => {
  if (!currentUserId) {
    alert("Please login to save resources");
    return;
  }

  try {
    if (isSaved(resourceId)) {
      const res = await fetchWithAuth(
        `http://localhost:8080/api/saved-resources/${resourceId}`,
        { method: 'DELETE' },
        token
      );

      if (res.status === 401) {
        logout();
        return;
      }

      if (!res.ok) throw new Error();

      setSavedResourceIds(prev => {
        const updated = new Set(prev);
        updated.delete(resourceId);
        return updated;
      });

    } else {
      const res = await fetchWithAuth(
        `http://localhost:8080/api/saved-resources/${resourceId}`,
        { method: 'POST' },
        token
      );

      if (res.status === 401) {
        logout();
        return;
      }

      if (!res.ok) throw new Error();

      setSavedResourceIds(prev => {
        const updated = new Set(prev);
        updated.add(resourceId);
        return updated;
      });
    }
  } catch (err) {
    console.error(err);
  }
};

  // Dynamic categories from backend data
  const categories = ['All', ...new Set(resources.map(r => r.category))];

  const filteredResources = resources.filter(
    r => selectedCategory === 'All' || r.category === selectedCategory
  );

  const openResourceLink = (resource) => {
    if (!resource?.link) return;
    window.open(resource.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <ProtectedBlur>
    <div className="resource-library-page">
      <div className="container">
        <section className="resource-header">
          <h1 className="page-title">Resource Library</h1>
          <p className="page-subtitle">
            Articles, guides, and tools to support your career journey
          </p>
        </section>

        <section className="resource-filters">
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="resources-section">
          <div className="resources-grid">
            {filteredResources.map(resource => (
              <Card
                key={resource.id}
                className="resource-library-card"
                onClick={() => openResourceLink(resource)}
                style={{ cursor: resource?.link ? 'pointer' : 'default' }}
              >
                <div className="resource-card-header" style={{ position: 'relative' }}>
                  {/*No "type" in backend → using category */}
                  <span className="resource-category-badge">
                    {resource.category}
                  </span>
                  <button
                    className={`icon-btn-sm bookmark-btn ${isSaved(resource.id) ? 'saved' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaved(resource.id);
                    }}
                    title={isSaved(resource.id) ? 'Remove from saved' : 'Save resource'}
                    aria-label="Bookmark"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px'
                    }}
                  >
                    {isSaved(resource.id) ? '★' : '☆'}
                  </button>
                </div>
                <h3 className="resource-card-title">{resource.title}</h3>
                <p className="resource-card-description">
                  {resource.description}
                </p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
    </ProtectedBlur>
  );
}

export default ResourceLibrary;