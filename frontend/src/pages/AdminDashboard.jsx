import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import './AdminDashboard.css';

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

const normalizeCommaSeparatedInput = (value) =>
  normalizeStringArray(value).join(', ');

const parseJsonIfPresent = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const { currentUser, token, logout } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [resources, setResources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentResource, setCurrentResource] = useState({
    id: null,
    title: '',
    category: '',
    description: '',
    link: ''
  });
  const [deleteId, setDeleteId] = useState(null);
  const base_URL = 'http://localhost:8080/api/resources';

  const [counsellors, setCounsellors] = useState([]);
  const [showCounsellorModal, setShowCounsellorModal] = useState(false);
  const [isEditCounsellor, setIsEditCounsellor] = useState(false);
  const [currentCounsellor, setCurrentCounsellor] = useState({
    id: null,
    name: '',
    email: '',
    experience: '',
    bio: '',
    expertise: ''
  });
  const [deleteCounsellorId, setDeleteCounsellorId] = useState(null);
  const counsellorsBaseUrl = 'http://localhost:8080/api/counsellors';

  const [careerList, setCareerList] = useState([]);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [isEditCareer, setIsEditCareer] = useState(false);
  const [currentCareer, setCurrentCareer] = useState({
    id: null,
    title: '',
    category: '',
    description: '',
    requiredSkills: '',
    roadmapSteps: []
  });
  const [deleteCareerId, setDeleteCareerId] = useState(null);

  const careersBaseUrl = 'http://localhost:8080/api/careers';

  useEffect(() => {
    fetchWithAuth('http://localhost:8080/api/admin/analytics', {}, token)
      .then(res => {
        if (res.status === 401) {
          logout();
          throw new Error('Unauthorized');
        }
        if (!res.ok) {
          throw new Error('Failed to fetch analytics');
        }
        return res.json();
      })
      .then(data => {
        console.log('Analytics:', data); // DEBUG
        setAnalytics(data);
      })
      .catch(err => {
        console.error(err);
        setAnalytics({});
      });
  }, [token, logout]);

  useEffect(() => {
    if (activeSection !== 'resources') return;
    let isMounted = true;

    const fetchResources = async () => {
     
      try {
        const res = await fetchWithAuth('http://localhost:8080/api/resources/me', {}, token);
        if (res.status === 401) {
          logout();
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch resources');
        const data = await res.json();
        if (isMounted) setResources(Array.isArray(data) ? data : []);
      } catch {
        if (isMounted) setResources([]);
        // Intentionally no UI changes.
      }
    };

    fetchResources();
    return () => {
      isMounted = false;
    };
  }, [activeSection, token, logout]);

  useEffect(() => {
    if (activeSection !== 'counsellors') return;
    let isMounted = true;

    const fetchCounsellors = async () => {
      try {
        const res = await fetchWithAuth(`${counsellorsBaseUrl}`, {}, token);
        if (res.status === 401) {
          logout();
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch counsellors');
        const data = await res.json();
        if (isMounted) setCounsellors(Array.isArray(data) ? data : []);
      } catch {
        if (isMounted) setCounsellors([]);
      }
    };

    fetchCounsellors();
    return () => {
      isMounted = false;
    };
  }, [activeSection, token, logout]);

  useEffect(() => {
    if (activeSection !== 'careers') return;

    fetchWithAuth(careersBaseUrl, {}, token)
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
      .then(data => setCareerList(Array.isArray(data) ? data : []))
      .catch(() => setCareerList([]));
  }, [activeSection, token, logout]);

  const handleAddClick = () => {
    setIsEdit(false);
    setCurrentResource({
      id: null,
      title: '',
      category: '',
      description: '',
      link: ''
    });
    setShowModal(true);
  };

  const handleEditClick = (resource) => {
    setIsEdit(true);
    setCurrentResource({
      id: resource?.id ?? null,
      title: resource?.title ?? '',
      category: resource?.category ?? '',
      description: resource?.description ?? '',
      link: resource?.link ?? ''
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e?.preventDefault?.();
    try {
      if (isEdit && currentResource?.id != null) {
        const res = await fetchWithAuth(`${base_URL}/${currentResource.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: currentResource.title,
            category: currentResource.category,
            description: currentResource.description,
            link: currentResource.link
          })
        }, token);
        if (res.status === 401) {
          logout();
          return;
        }
        if (!res.ok) throw new Error('Failed to update resource');
        const updated = await parseJsonIfPresent(res);
        if (updated?.id != null) {
          setResources(prev =>
            prev.map(r => (r.id === updated.id ? updated : r))
          );
        } else {
          const latest = await fetchWithAuth('http://localhost:8080/api/resources/me', {}, token);
          if (latest.ok) {
            const data = await latest.json();
            setResources(Array.isArray(data) ? data : []);
          }
        }
      } else {
        const res = await fetchWithAuth(`${base_URL}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: currentResource.title,
            category: currentResource.category,
            description: currentResource.description,
            link: currentResource.link
          })
        }, token);
        if (res.status === 401) {
          logout();
          return;
        }
        if (!res.ok) throw new Error('Failed to create resource');
        const created = await parseJsonIfPresent(res);
        if (created?.id != null) {
          setResources(prev => [created, ...prev]);
        } else {
          const latest = await fetchWithAuth('http://localhost:8080/api/resources/me', {}, token);
          if (latest.ok) {
            const data = await latest.json();
            setResources(Array.isArray(data) ? data : []);
          }
        }
      }

      setShowModal(false);
      setIsEdit(false);
      setCurrentResource({
        id: null,
        title: '',
        category: '',
        description: '',
        link: ''
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (id == null) return;
    try {
      const res = await fetchWithAuth(`${base_URL}/${id}`, {
        method: 'DELETE'
      }, token);
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) throw new Error('Failed to delete resource');
      setResources(prev => prev.filter(r => r.id !== id));
      setDeleteId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleResourceCardClick = (resource) => {
    const url = resource?.link;
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddCounsellorClick = () => {
    setIsEditCounsellor(false);
    setCurrentCounsellor({
      id: null,
      name: '',
      email: '',
      experience: '',
      bio: '',
      expertise: ''
    });
    setShowCounsellorModal(true);
  };

  const handleEditCounsellorClick = (counsellor) => {
    setIsEditCounsellor(true);
    setCurrentCounsellor({
      id: counsellor?.id ?? null,
      name: counsellor?.name ?? '',
      email: counsellor?.email ?? '',
      experience: counsellor?.experience != null ? String(counsellor.experience) : '',
      bio: counsellor?.bio ?? '',
      expertise: normalizeCommaSeparatedInput(counsellor?.expertise)
    });
    setShowCounsellorModal(true);
  };

  const handleSaveCounsellor = async (e) => {
  e?.preventDefault?.();

  try {
    const experienceNum =
      currentCounsellor.experience === ''
        ? null
        : Number(currentCounsellor.experience);

    if (import.meta.env.DEV) {
      console.log(typeof currentCounsellor.expertise, currentCounsellor.expertise);
    }

    const payload = {
      name: currentCounsellor.name,
      email: currentCounsellor.email,
      experience: experienceNum,
      bio: currentCounsellor.bio,
      expertise: normalizeStringArray(currentCounsellor.expertise)
    };

    if (isEditCounsellor && currentCounsellor?.id != null) {
      const res = await fetchWithAuth(
        `${counsellorsBaseUrl}/${currentCounsellor.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        },
        token
      );

      if (res.status === 401) {
        logout();
        return;
      }

      if (!res.ok) throw new Error('Failed to update counsellor');

      const updated = await parseJsonIfPresent(res);

      if (updated?.id != null) {
        setCounsellors(prev =>
          prev.map(c => (c.id === updated.id ? updated : c))
        );
      } else {
        const latest = await fetchWithAuth(counsellorsBaseUrl, {}, token);
        if (latest.ok) {
          const data = await latest.json();
          setCounsellors(Array.isArray(data) ? data : []);
        }
      }
    } else {
      const res = await fetchWithAuth(`${counsellorsBaseUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }, token);

      if (res.status === 401) {
        logout();
        return;
      }

      if (!res.ok) throw new Error('Failed to create counsellor');

      const created = await parseJsonIfPresent(res);

      if (created?.id != null) {
        setCounsellors(prev => [created, ...prev]);
      } else {
        const latest = await fetchWithAuth(counsellorsBaseUrl, {}, token);
        if (latest.ok) {
          const data = await latest.json();
          setCounsellors(Array.isArray(data) ? data : []);
        }
      }
    }

    setShowCounsellorModal(false);
    setIsEditCounsellor(false);

    setCurrentCounsellor({
      id: null,
      name: '',
      email: '',
      experience: '',
      bio: '',
      expertise: ''
    });

  } catch (err) {
    console.error(err);
  }
};

  const handleDeleteCounsellor = async (id) => {
    if (id == null) return;
    try {
      const res = await fetchWithAuth(`${counsellorsBaseUrl}/${id}`, {
        method: 'DELETE'
      }, token);
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) throw new Error('Failed to delete counsellor');
      setCounsellors(prev => prev.filter(c => c.id !== id));
      setDeleteCounsellorId(null);
    } catch (error) {
      console.error(error);
    }
  };
   
  const handleCounsellorCardClick = (counsellor) => {
    const email = counsellor?.email;
    if (!email) return;
    window.open(`mailto:${email}`, '_blank', 'noopener,noreferrer');
  };

  const handleAddCareerClick = () => {
    setIsEditCareer(false);
    setCurrentCareer({
      id: null,
      title: '',
      category: '',
      description: '',
      requiredSkills: '',
      roadmapSteps: []
    });
    setShowCareerModal(true);
  };

  const handleEditCareerClick = (career) => {
    setIsEditCareer(true);
    setCurrentCareer({
      id: career?.id ?? null,
      title: career?.title ?? '',
      category: career?.category ?? '',
      description: career?.description ?? '',
        requiredSkills: normalizeCommaSeparatedInput(career?.requiredSkills),
      roadmapSteps: Array.isArray(career?.roadmapSteps)
  ? career.roadmapSteps.map(step => ({
      stepNumber: step.stepNumber || 0,
      title: step.title || '',
      description: step.description || '',
      duration: step.duration || ''
    }))
  : []
    });
    setShowCareerModal(true);
  };

  const handleAddStep = () => {
    setCurrentCareer(c => ({
      ...c,
      roadmapSteps: [
        ...c.roadmapSteps,
        {
          stepNumber: c.roadmapSteps.length + 1,
          title: '',
          description: '',
          duration: ''
        }
      ]
    }));
  };

const handleStepChange = (index, field, value) => {
  setCurrentCareer(c => {
    const roadmapSteps = [...(c.roadmapSteps || [])];

    roadmapSteps[index] = {
      ...roadmapSteps[index],
      [field]:
        field === 'duration'
          ? value === ''
            ? ''
            : parseInt(value, 10) || 0
          : value
    };

    return { ...c, roadmapSteps };
  });
};

  const handleDeleteStep = (index) => {
    setCurrentCareer(c => {
      const roadmapSteps = (c.roadmapSteps || []).filter((_, i) => i !== index);
      return {
        ...c,
        roadmapSteps: roadmapSteps.map((step, i) => ({
          ...step,
          stepNumber: i + 1
        }))
      };
    });
  };

  const handleSaveCareer = async (e) => {
    e?.preventDefault?.();

    try {
      const payload = {
        title: currentCareer.title,
        category: currentCareer.category,
        description: currentCareer.description,
        requiredSkills: normalizeStringArray(currentCareer.requiredSkills),
        roadmapSteps: currentCareer.roadmapSteps
      };

      if (isEditCareer && currentCareer?.id != null) {
        const res = await fetchWithAuth(`${careersBaseUrl}/${currentCareer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }, token);
        if (res.status === 401) {
          logout();
          return;
        }
        if (!res.ok) throw new Error('Failed to update career');
        const updated = await parseJsonIfPresent(res);

        if (updated?.id != null) {
          setCareerList(prev => prev.map(c => (c.id === updated.id ? updated : c)));
        } else {
          const latest = await fetchWithAuth(careersBaseUrl, {}, token);
          if (latest.ok) {
            const data = await latest.json();
            setCareerList(Array.isArray(data) ? data : []);
          }
        }
      } else {
        const res = await fetchWithAuth(`${careersBaseUrl}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }, token);
        if (res.status === 401) {
          logout();
          return;
        }
        if (!res.ok) throw new Error('Failed to create career');
        const created = await parseJsonIfPresent(res);

        if (created?.id != null) {
          setCareerList(prev => [created, ...prev]);
        } else {
          const latest = await fetchWithAuth(careersBaseUrl, {}, token);
          if (latest.ok) {
            const data = await latest.json();
            setCareerList(Array.isArray(data) ? data : []);
          }
        }
      }

      setShowCareerModal(false);
      setIsEditCareer(false);
      setCurrentCareer({
        id: null,
        title: '',
        category: '',
        description: '',
        requiredSkills: '',
        roadmapSteps: []
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCareer = async (id) => {
    if (id == null) return;
    try {
      const res = await fetchWithAuth(`${careersBaseUrl}/${id}`, {
        method: 'DELETE'
      }, token);

      if (res.status === 401) {
        logout();
        return;
      }

      if (!res.ok) throw new Error('Failed to delete career');

      setCareerList(prev => prev.filter(c => c.id !== id));
      setDeleteCareerId(null);
    } catch (error) {
      console.error(error);
    }
  };

  if (!analytics) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <aside className="admin-sidebar">
          <h2 className="sidebar-title">Menu</h2>
          {currentUser && (
            <p className="admin-user-name">Welcome, {currentUser.name}</p>
          )}
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSection('overview')}
            >
              Overview
            </button>
            <button
              className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveSection('analytics')}
            >
              Analytics
            </button>
            <button
              className={`nav-item ${activeSection === 'careers' ? 'active' : ''}`}
              onClick={() => setActiveSection('careers')}
            >
              Manage Careers
            </button>
            <button
              className={`nav-item ${activeSection === 'counsellors' ? 'active' : ''}`}
              onClick={() => setActiveSection('counsellors')}
            >
              Manage Counsellors
            </button>
            <button
              className={`nav-item ${activeSection === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveSection('resources')}
            >
              Manage Resources
            </button>
          </nav>
        </aside>

        <main className="admin-main">
          {activeSection === 'overview' && (
            <div className="admin-section">
              <h1 className="admin-page-title">Dashboard Overview</h1>
              <div className="metrics-grid">
                <Card className="metric-card">
                  <div className="metric-icon">👥</div>
                  <div className="metric-value">{(analytics?.totalUsers ?? 0).toLocaleString()}</div>
                  <div className="metric-label">Total Users</div>
                </Card>
                
                <Card className="metric-card">
                  <div className="metric-icon">📚</div>
                  <div className="metric-value">{analytics?.totalResources ?? 0}</div>
                  <div className="metric-label">Total Resources</div>
                </Card>
                <Card className="metric-card">
                  <div className="metric-icon">🤝</div>
                  <div className="metric-value">{analytics?.totalCounsellors ?? 0}</div>
                  <div className="metric-label">Counsellors</div>
                </Card>
                
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div className="admin-section">
              <h1 className="admin-page-title">Analytics Dashboard</h1>
              <div className="analytics-grid">
                <Card className="analytics-card">
                  <div className="analytics-icon">👥</div>
                  <div className="analytics-value">{(analytics?.totalUsers ?? 0).toLocaleString()}</div>
                  <div className="analytics-label">Total Users</div>
                </Card>
                <Card className="analytics-card highlight-blue">
                  <div className="analytics-icon">📚</div>
                  <div className="analytics-value">{analytics?.totalSavedResources ?? 0}</div>
                  <div className="analytics-label">Saved Resources</div>
                  <div className="analytics-sub">&nbsp;</div>
                </Card>
                <Card className="analytics-card highlight-red">
                  <div className="analytics-icon">💼</div>
                  <div className="analytics-value">{analytics?.totalSavedCareers ?? 0}</div>
                  <div className="analytics-label">Saved Careers</div>
                  <div className="analytics-sub">&nbsp;</div>
                </Card>
                <Card className="analytics-card">
                  <div className="analytics-icon">📈</div>
                  <div className="analytics-value">{analytics?.totalBookings ?? 0}</div>
                  <div className="analytics-label">Bookings</div>
                </Card>
              </div>
            </div>
          )}

          {activeSection === 'careers' && (
            <div className="admin-section">
              <div className="section-header">
                <h1 className="admin-page-title">Manage Career Resources</h1>
                <button className="btn btn-primary" onClick={handleAddCareerClick}>Add New Career</button>
              </div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Skills Count</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {careerList.map(career => (
                      <tr key={career.id}>
                        <td>{career.id}</td>
                        <td>{career.title}</td>
                        <td><span className="badge">{career.category}</span></td>
                        <td>{career.requiredSkills?.length || 0}</td>
                        <td>
                          <div className="table-actions">
                            <button className="btn-action edit" onClick={() => handleEditCareerClick(career)}>Edit</button>
                            <button className="btn-action delete" onClick={() => setDeleteCareerId(career.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showCareerModal && (
                <section className="scheduling-modal">
                  <div className="modal-overlay" onClick={() => setShowCareerModal(false)}></div>
                  <div className="modal-content booking-modal">
                    <div className="modal-header">
                      <h2>{isEditCareer ? 'Edit Career' : 'Add New Career Path'}</h2>
                      <button className="modal-close" onClick={() => setShowCareerModal(false)}>×</button>
                    </div>
                    <form onSubmit={handleSaveCareer} className="scheduling-form">
                      <div className="form-group">
                        <label htmlFor="career-title">Title</label>
                        <input
                          id="career-title"
                          type="text"
                          className="form-input"
                          value={currentCareer.title}
                          onChange={(e) => setCurrentCareer(c => ({ ...c, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="career-category">Category</label>
                        <input
                          id="career-category"
                          type="text"
                          className="form-input"
                          value={currentCareer.category}
                          onChange={(e) => setCurrentCareer(c => ({ ...c, category: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="career-description">Description</label>
                        <textarea
                          id="career-description"
                          className="form-textarea"
                          rows="4"
                          value={currentCareer.description}
                          onChange={(e) => setCurrentCareer(c => ({ ...c, description: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="career-required-skills">Required Skills</label>
                        <input
                          id="career-required-skills"
                          type="text"
                          className="form-input"
                          value={currentCareer.requiredSkills}
                          onChange={(e) => setCurrentCareer(c => ({ ...c, requiredSkills: e.target.value }))}
                          required
                        />
                      </div>

                      <h3>Roadmap Steps</h3>
                      {currentCareer.roadmapSteps.map((step, index) => (
                        <div key={index}>
                          <div className="form-group">
                            <label htmlFor={`career-step-title-${index}`}>Title (Step {index + 1})</label>
                            <input
                              id={`career-step-title-${index}`}
                              type="text"
                              className="form-input"
                              value={step.title}
                              onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor={`career-step-description-${index}`}>Description (Step {index + 1})</label>
                            <textarea
                              id={`career-step-description-${index}`}
                              className="form-textarea"
                              rows="3"
                              value={step.description}
                              onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor={`career-step-duration-${index}`}>Duration (Step {index + 1})</label>
                            <input
                              id={`career-step-duration-${index}`}
                              type="number"
                              className="form-input"
                              value={step.duration}
                              onChange={(e) => handleStepChange(index, 'duration', e.target.value)}
                              required
                            />
                          </div>
                          <button type="button" className="btn btn-outline" onClick={() => handleDeleteStep(index)}>
                            Delete Step
                          </button>
                        </div>
                      ))}

                      <button type="button" className="btn btn-outline" onClick={handleAddStep}>
                        + Add Step
                      </button>

                      <div className="form-actions">
                        <button type="button" className="btn btn-outline" onClick={() => setShowCareerModal(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-secondary">
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </section>
              )}

              {deleteCareerId != null && (
                <section className="scheduling-modal">
                  <div className="modal-overlay" onClick={() => setDeleteCareerId(null)}></div>
                  <div className="modal-content booking-modal">
                    <div className="modal-header">
                      <h2>Confirm Delete</h2>
                      <button className="modal-close" onClick={() => setDeleteCareerId(null)}>×</button>
                    </div>
                    <div className="scheduling-form">
                      <p>Are you sure you want to delete?</p>
                      <div className="form-actions">
                        <button type="button" className="btn btn-outline" onClick={() => setDeleteCareerId(null)}>
                          Cancel
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => handleDeleteCareer(deleteCareerId)}>
                          Yes, Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          )}

          {activeSection === 'counsellors' && (
            <div className="admin-section">
              <div className="section-header">
                <h1 className="admin-page-title">Manage Counsellors</h1>
                <button className="btn btn-primary" onClick={handleAddCounsellorClick}>Add New Counsellor</button>
              </div>
              <div className="counsellors-admin-grid">
                {counsellors.map(counsellor => (
                  <Card
                    key={counsellor.id}
                    className="counsellor-admin-card"
                    onClick={() => handleCounsellorCardClick(counsellor)}
                  >
                    <div className="counsellor-admin-header">
                      <h3>{counsellor.name}</h3>
                      <span className="experience-badge">{counsellor.experience} years</span>
                    </div>
                    <p className="counsellor-admin-bio">{counsellor.bio}</p>
                    <div className="counsellor-admin-expertise">
                      <strong>Expertise:</strong>{" "}
                          {Array.isArray(counsellor.expertise)
                            ? counsellor.expertise.join(", ")
                            : counsellor.expertise || ""}
                    </div>
                    <div className="counsellor-admin-actions">
                      <button className="btn btn-outline" onClick={(e) => { e.stopPropagation(); handleEditCounsellorClick(counsellor); }}>Edit</button>
                      <button className="btn btn-outline" onClick={(e) => { e.stopPropagation(); setDeleteCounsellorId(counsellor.id); }}>Delete</button>
                    </div>
                  </Card>
                ))}
              </div>

              {showCounsellorModal && (
                <section className="scheduling-modal">
                  <div className="modal-overlay" onClick={() => setShowCounsellorModal(false)}></div>
                  <div className="modal-content booking-modal">
                    <div className="modal-header">
                      <h2>{isEditCounsellor ? 'Edit Counsellor' : 'Add New Counsellor'}</h2>
                      <button className="modal-close" onClick={() => setShowCounsellorModal(false)}>×</button>
                    </div>
                    <form onSubmit={handleSaveCounsellor} className="scheduling-form">
                      <div className="form-group">
                        <label htmlFor="counsellor-name">Name</label>
                        <input
                          id="counsellor-name"
                          type="text"
                          className="form-input"
                          value={currentCounsellor.name}
                          onChange={(e) => setCurrentCounsellor(c => ({ ...c, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="counsellor-email">Email</label>
                        <input
                          id="counsellor-email"
                          type="email"
                          className="form-input"
                          value={currentCounsellor.email}
                          onChange={(e) => setCurrentCounsellor(c => ({ ...c, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="counsellor-experience">Experience</label>
                        <input
                          id="counsellor-experience"
                          type="text"
                          className="form-input"
                          value={currentCounsellor.experience}
                          onChange={(e) => setCurrentCounsellor(c => ({ ...c, experience: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="counsellor-bio">Bio</label>
                        <textarea
                          id="counsellor-bio"
                          className="form-textarea"
                          rows="4"
                          value={currentCounsellor.bio}
                          onChange={(e) => setCurrentCounsellor(c => ({ ...c, bio: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="counsellor-expertise">Expertise</label>
                        <input
                          id="counsellor-expertise"
                          type="text"
                          className="form-input"
                          value={currentCounsellor.expertise}
                          onChange={(e) => setCurrentCounsellor(c => ({ ...c, expertise: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="form-actions">
                        <button type="button" className="btn btn-outline" onClick={() => setShowCounsellorModal(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-secondary">
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </section>
              )}

              {deleteCounsellorId != null && (
                <section className="scheduling-modal">
                  <div className="modal-overlay" onClick={() => setDeleteCounsellorId(null)}></div>
                  <div className="modal-content booking-modal">
                    <div className="modal-header">
                      <h2>Confirm Delete</h2>
                      <button className="modal-close" onClick={() => setDeleteCounsellorId(null)}>×</button>
                    </div>
                    <div className="scheduling-form">
                      <p>Are you sure you want to delete?</p>
                      <div className="form-actions">
                        <button type="button" className="btn btn-outline" onClick={() => setDeleteCounsellorId(null)}>
                          Cancel
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => handleDeleteCounsellor(deleteCounsellorId)}>
                          Yes, Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          )}

          {activeSection === 'resources' && (
            <div className="admin-section">
              <div className="section-header">
                <h1 className="admin-page-title">Manage Resources</h1>
                <button className="btn btn-primary" onClick={handleAddClick}>Add New Resource</button>
              </div>
              <div className="resources-admin-grid">
                {resources.map(resource => (
                  <Card
                    key={resource.id}
                    className="resource-admin-card"
                    onClick={() => handleResourceCardClick(resource)}
                  >
                    <div className="resource-admin-header">
                      <h3>{resource.title}</h3>
                      <span className="resource-type-badge">{resource.category}</span>
                    </div>
                    <p className="resource-admin-description">{resource.description}</p>
                    <div className="resource-admin-meta">
                      <span className="resource-category">{resource.category}</span>
                    </div>
                    <div className="resource-admin-actions">
                      <button className="btn btn-outline" onClick={(e) => { e.stopPropagation(); handleEditClick(resource); }}>Edit</button>
                      <button className="btn btn-outline" onClick={(e) => { e.stopPropagation(); setDeleteId(resource.id); }}>Delete</button>
                    </div>
                  </Card>
                ))}
              </div>

              {showModal && (
                <section className="scheduling-modal">
                  <div className="modal-overlay" onClick={() => setShowModal(false)}></div>
                  <div className="modal-content booking-modal">
                    <div className="modal-header">
                      <h2>{isEdit ? 'Edit Resource' : 'Add New Resource'}</h2>
                      <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                    </div>
                    <form onSubmit={handleSave} className="scheduling-form">
                      <div className="form-group">
                        <label htmlFor="resource-title">Title</label>
                        <input
                          id="resource-title"
                          type="text"
                          className="form-input"
                          value={currentResource.title}
                          onChange={(e) => setCurrentResource(r => ({ ...r, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="resource-category">Category</label>
                        <input
                          id="resource-category"
                          type="text"
                          className="form-input"
                          value={currentResource.category}
                          onChange={(e) => setCurrentResource(r => ({ ...r, category: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="resource-description">Description</label>
                        <textarea
                          id="resource-description"
                          className="form-textarea"
                          rows="4"
                          value={currentResource.description}
                          onChange={(e) => setCurrentResource(r => ({ ...r, description: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="resource-link">Link</label>
                        <input
                          id="resource-link"
                          type="text"
                          className="form-input"
                          value={currentResource.link}
                          onChange={(e) => setCurrentResource(r => ({ ...r, link: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="form-actions">
                        <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-secondary">
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </section>
              )}

              {deleteId != null && (
                <section className="scheduling-modal">
                  <div className="modal-overlay" onClick={() => setDeleteId(null)}></div>
                  <div className="modal-content booking-modal">
                    <div className="modal-header">
                      <h2>Confirm Delete</h2>
                      <button className="modal-close" onClick={() => setDeleteId(null)}>×</button>
                    </div>
                    <div className="scheduling-form">
                      <p>Are you sure you want to delete?</p>
                      <div className="form-actions">
                        <button type="button" className="btn btn-outline" onClick={() => setDeleteId(null)}>
                          Cancel
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => handleDelete(deleteId)}>
                          Yes, Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;

