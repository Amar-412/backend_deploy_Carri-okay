import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockUserSkills } from '../data/userSkills';
import { useAuth } from '../contexts/AuthContext';
import { useComparison } from '../contexts/ComparisonContext';
import Card from '../components/Card';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import './CareerDetail.css';

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

function CareerDetail() {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [savedCareerIds, setSavedCareerIds] = useState(new Set());
  const { currentUser, token, logout } = useAuth();
  const { addToCompare, isInCompare, removeFromCompare } = useComparison();
  const currentUserId = getUserId(currentUser);

  useEffect(() => {
    if (!id) {
      setCareer(null);
      return;
    }

    fetchWithAuth(`${API_BASE}/careers/${id}`, {}, token)
      .then(res => {
        if (res.status === 401) {
          logout();
          throw new Error('Unauthorized');
        }
        if (!res.ok) {
          throw new Error('Failed to fetch career details');
        }
        return res.json();
      })
      .then(data => setCareer(data))
      .catch(() => setCareer(null));
  }, [id, token, logout]);

  useEffect(() => {
    if (!currentUserId) {
      setSavedCareerIds(new Set());
      return;
    }

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
            .filter((savedId) => savedId != null)
        );
        setSavedCareerIds(ids);
      })
      .catch(() => setSavedCareerIds(new Set()));
  }, [currentUserId, token, logout]);

  const isSaved = (careerId) => savedCareerIds.has(careerId);

  const toggleSaved = async (careerId) => {
    if (!currentUserId) {
      alert('Please login to save careers');
      return;
    }

    try {
      const method = isSaved(careerId) ? 'DELETE' : 'POST';
      const res = await fetchWithAuth(
        `${API_BASE}/saved-careers/${careerId}`,
        { method },
        token
      );

      if (res.status === 401) {
        logout();
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to update saved career');
      }

      setSavedCareerIds((prev) => {
        const updated = new Set(prev);
        if (method === 'DELETE') {
          updated.delete(careerId);
        } else {
          updated.add(careerId);
        }
        return updated;
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!career) {
    return (
      <div className="career-detail-page">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const userSkillsSet = new Set(mockUserSkills.map(s => s.toLowerCase()));
  const requiredSkillsList = normalizeStringArray(career.requiredSkills);
  const requiredSkills = requiredSkillsList.map(skill => ({
    name: skill,
    hasSkill: userSkillsSet.has(skill.toLowerCase())
  }));
  const hasCount = requiredSkills.filter(s => s.hasSkill).length;
  const skillProgress =
    requiredSkillsList.length > 0
      ? (hasCount / requiredSkillsList.length) * 100
      : 0;
  const roadmap = (career.roadmapSteps || [])
    .sort((a, b) => a.stepNumber - b.stepNumber);

  return (
    <div className="career-detail-page">
      <div className="container">
        <div className="career-detail-header">
          <div className="career-detail-title-row">
            <h1 className="career-detail-title">{career.title}</h1>
            <div className="career-detail-actions">
              <button
                className={`icon-btn bookmark-btn ${isSaved(career.id) ? 'saved' : ''}`}
                onClick={() => toggleSaved(career.id)}
                title={isSaved(career.id) ? 'Remove from saved' : 'Save career'}
                aria-label="Bookmark"
              >
                {isSaved(career.id) ? '★' : '☆'}
              </button>
              <button
                className={`icon-btn compare-btn ${isInCompare(career.id) ? 'active' : ''}`}
                onClick={() => isInCompare(career.id) ? removeFromCompare(career.id) : addToCompare(career)}
                title="Compare careers"
                aria-label="Compare"
              >
                ⇔
              </button>
            </div>
          </div>
          <span className="career-detail-category">{career.category}</span>
          <p className="career-detail-description">{career.description}</p>
        </div>

        <section className="skill-gap-section">
          <h2 className="section-heading">Skill Gap Analysis</h2>
          <Card className="skill-gap-card">
            <div className="skill-gap-overview">
              <div className="progress-bar-container">
                <div className="progress-bar-label">
                  <span>Your skill match</span>
                  <span>{Math.round(skillProgress)}%</span>
                </div>
                <div className="skill-progress-bar">
                  <div
                    className="skill-progress-fill"
                    style={{ width: `${skillProgress}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="skills-breakdown">
              <h4>Required Skills</h4>
              <div className="skills-list">
                {requiredSkills.map((s, idx) => (
                  <div
                    key={idx}
                    className={`skill-item ${s.hasSkill ? 'has-skill' : 'missing-skill'}`}
                  >
                    <span className="skill-name">{s.name}</span>
                    <span className="skill-status">{s.hasSkill ? '✓' : '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {(roadmap || []).length > 0 && (
          <section className="roadmap-section">
            <h2 className="section-heading">Career Roadmap</h2>
            <div className="roadmap-timeline">
              {(roadmap || []).map((step, idx) => (
                <div key={idx} className="roadmap-step">
                  <div className="roadmap-marker">
                    <span className="roadmap-step-num">{step.stepNumber}</span>
                  </div>
                  <div className="roadmap-content">
                    <h4 className="roadmap-title">{step.title}</h4>
                    <p className="roadmap-description">{step.description}</p>
                    <span className="roadmap-duration">{step.duration}</span>
                  </div>
                  {idx < roadmap.length - 1 && <div className="roadmap-connector" />}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="career-detail-footer">
          <Link to="/career-paths" className="btn btn-outline">Back to Careers</Link>
          <Link to="/counseling" className="btn btn-primary">Book Counseling Session</Link>
        </div>
      </div>
    </div>
  );
}

export default CareerDetail;
