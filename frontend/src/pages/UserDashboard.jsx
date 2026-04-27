import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import './UserDashboard.css';

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

const getSavedResourceId = (item) =>
  item?.resourceId ?? item?.id ?? item?.resource?.id ?? null;

function UserDashboard() {
  const { currentUser, token, logout } = useAuth();
  const currentUserId = getUserId(currentUser);
  const [savedCareers, setSavedCareers] = useState([]);
  const [savedResources, setSavedResources] = useState([]);
  const [recommendedCareers, setRecommendedCareers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [allCareers, setAllCareers] = useState([]);
  const [allResources, setAllResources] = useState([]);

  useEffect(() => {
    fetchWithAuth('http://localhost:8080/api/careers', {}, token)
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
      .then(data => setAllCareers(Array.isArray(data) ? data : []))
      .catch(() => setAllCareers([]));

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
      .then(data => setAllResources(Array.isArray(data) ? data : []))
      .catch(() => setAllResources([]));
  }, [token, logout]);

  useEffect(() => {
    if (!currentUserId) return;

    fetchWithAuth('http://localhost:8080/api/saved-careers', {}, token)
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
        setSavedCareers(allCareers.filter(c => ids.has(c.id)));
      })
      .catch(() => setSavedCareers([]));

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
        setSavedResources(allResources.filter(r => ids.has(r.id)));
      })
      .catch(() => setSavedResources([]));

    fetchWithAuth('http://localhost:8080/api/bookings/me', {}, token)
      .then(res => {
        if (res.status === 401) {
          logout();
          throw new Error('Unauthorized');
        }
        if (!res.ok) {
          throw new Error('Failed to fetch bookings');
        }
        return res.json();
      })
      .then(data => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]));

    fetchWithAuth('http://localhost:8080/api/quiz/me', {}, token)
      .then(res => {
        if (res.status === 401) {
          logout();
          throw new Error('Unauthorized');
        }
        if (!res.ok) {
          throw new Error('Failed to fetch quiz results');
        }
        return res.json();
      })
      .then(data => {
        if (!data || !data.careerIds) {
          setRecommendedCareers([]);
          return;
        }

        const ids = new Set(data.careerIds);

        const matchedCareers = allCareers.filter(c => ids.has(c.id));

        setRecommendedCareers(matchedCareers);
      })
      .catch(() => setRecommendedCareers([]));
  }, [currentUserId, allCareers, allResources, token, logout]);

  const upcomingBookings = bookings.filter(b => b.status === "BOOKED");

  const openResourceLink = (resource) => {
    if (!resource?.link) return;
    window.open(resource.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="user-dashboard">
      <div className="container">
        <section className="dashboard-header">
          <h1 className="dashboard-title">Welcome Back{currentUser ? `, ${currentUser.name}` : ''}!</h1>
          <p className="dashboard-subtitle">Here's your personalized career dashboard</p>
        </section>

        {savedCareers.length > 0 && (
          <section className="dashboard-section">
            <h2 className="section-heading">Saved Careers</h2>
            <div className="career-cards-grid">
              {savedCareers.map((career) => (
                <Card key={career.id} className="career-card">
                  <div className="career-card-header">
                    <h3 className="career-card-title">
                      <Link to={`/career-paths/${career.id}`}>{career.title}</Link>
                    </h3>
                  </div>
                  <p className="career-card-description">{career.description}</p>
                  <div className="career-card-skills">
                    <strong>Key Skills:</strong>
                    <div className="skills-tags">
                      {normalizeStringArray(career.requiredSkills).slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <Link to={`/career-paths/${career.id}`} className="btn btn-outline">View Details</Link>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="dashboard-section">
          <h2 className="section-heading">Recommended Career Paths</h2>
          <div className="career-cards-grid">
            {recommendedCareers.map((career) => (
              <Card key={career.id} className="career-card">
                <div className="career-card-header">
                  <h3 className="career-card-title">
                    <Link to={`/career-paths/${career.id}`}>{career.title}</Link>
                  </h3>
                  {career.matchScore != null && (
                    <span className="match-badge">{career.matchScore}% Match</span>
                  )}
                </div>
                <p className="career-card-description">{career.description}</p>
                <div className="career-card-skills">
                  <strong>Key Skills:</strong>
                  <div className="skills-tags">
                    {normalizeStringArray(career.requiredSkills).slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                <Link to={`/career-paths/${career.id}`} className="btn btn-outline">View Details</Link>
              </Card>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="section-heading">Upcoming Counseling Sessions</h2>
          <div className="sessions-grid">
            {upcomingBookings.map((session) => (
              <Card key={session.id} className="session-card">
                <div className="session-card-header">
                  <h3 className="session-counsellor">{session.counsellor?.name}</h3>
                  <span className="session-topic">{normalizeStringArray(session.counsellor?.expertise).join(', ')}
                  </span>
                </div>
                <div className="session-details">
                  <div className="session-detail">
                    <strong>Date:</strong> {session.date}
                  </div>
                  <div className="session-detail">
                    <strong>Time:</strong> {session.time}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="section-heading">Saved Resources</h2>
          <div className="resources-grid">
            {savedResources.map((resource) => (
              <Card
                key={resource.id}
                className="resource-card"
                onClick={() => openResourceLink(resource)}
                style={{ cursor: resource?.link ? 'pointer' : 'default' }}
              >
                        <div className="resource-card-header">
                          <span className="resource-category-badge">
                            {resource.category}
                          </span>
                        </div>
                        <h3 className="resource-title">{resource.title}</h3>
                        <p className="resource-description">
                                {resource.description}
                        </p>
                </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserDashboard;
