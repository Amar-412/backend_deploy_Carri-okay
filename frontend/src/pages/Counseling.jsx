import { useEffect, useState } from 'react';
import { sessionTypes } from '../data/sessionTypes';
import { timeSlots } from '../data/timeSlots';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import ProtectedBlur from '../components/ProtectedBlur';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import './Counseling.css';

const BOOKING_STEPS = ['date', 'time', 'session', 'confirm'];

const COUNSELLORS_API = 'http://localhost:8080/api/counsellors';
const getUserId = (user) => user?.id ?? user?.userId ?? user?.uid ?? null;

function normalizeCounsellorExpertise(raw) {
  if (typeof raw === 'string') {
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  }
  if (Array.isArray(raw)) {
    return raw;
  }
  return [];
}

function normalizeCounsellorForUi(c) {
  return { ...c, expertise: normalizeCounsellorExpertise(c.expertise) };
}

function Counseling() {
  const { currentUser, token, logout } = useAuth();
  const currentUserId = getUserId(currentUser);
  const [counsellors, setCounsellors] = useState([]);
  const [bookingError, setBookingError] = useState('');
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    sessionType: '',
    topic: ''
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetchWithAuth(COUNSELLORS_API, {}, token);
        if (res.status === 401) {
          logout();
          throw new Error('Unauthorized');
        }
        if (!res.ok) throw new Error('Failed to load counsellors');
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        if (!cancelled) {
          setCounsellors(list.map(normalizeCounsellorForUi));
        }
      } catch {
        if (!cancelled) setCounsellors([]);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  const handleModalClose = () => {
    setSelectedCounsellor(null);
    setBookingStep(0);
    setBookingError('');
  };

  const handleScheduleClick = (counsellor) => {
    setSelectedCounsellor(normalizeCounsellorForUi(counsellor));
    setBookingStep(0);
    setFormData({ date: '', time: '', sessionType: '', topic: '' });
    setBookingError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (bookingStep < BOOKING_STEPS.length - 1) return;
    setBookingError('');

    if (!currentUser) {
      setBookingError('Please login first');
      return;
    }

    const counsellorId = selectedCounsellor?.id;

    if (!currentUserId || !counsellorId) {
      setBookingError('Missing booking details. Please try again.');
      return;
    }

    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/api/bookings/${counsellorId}`,
        {
          method: 'POST',
          body: JSON.stringify({
            date: formData.date,
            time: formData.time
          })
        },
        token
      );

      if (res.status === 401) {
        logout();
        setBookingError('Session expired. Please login again.');
        return;
      }

      if (!res.ok) {
        let errMsg = 'Booking failed';
        try {
          const text = await res.text();
          if (text) {
            try {
              const errBody = JSON.parse(text);
              errMsg =
                errBody.message ||
                errBody.error ||
                (typeof errBody === 'string' ? errBody : errMsg);
            } catch {
              errMsg = text;
            }
          }
        } catch {
          /* keep default */
        }
        setBookingError(errMsg);
        return;
      }

      alert('Booking Confirmed');
      setSelectedCounsellor(null);
      setBookingStep(0);
      setFormData({ date: '', time: '', sessionType: '', topic: '' });
      setBookingError('');
    } catch (err) {
      setBookingError(err?.message || 'Something went wrong');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const canProceed = () => {
    switch (BOOKING_STEPS[bookingStep]) {
      case 'date': return !!formData.date;
      case 'time': return !!formData.time;
      case 'session': return !!formData.sessionType;
      case 'confirm': return !!formData.topic;
      default: return false;
    }
  };

  const handleNext = () => {
    if (bookingStep < BOOKING_STEPS.length - 1) setBookingStep(s => s + 1);
  };

  const handleBack = () => {
    if (bookingStep > 0) setBookingStep(s => s - 1);
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <span className="star-rating" aria-label={`${rating} out of 5 stars`}>
        {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(empty)}
      </span>
    );
  };

  return (
    <ProtectedBlur>
    <div className="counseling-page">
      <div className="container">
        <section className="counseling-header">
          <h1 className="page-title">Book a Counseling Session</h1>
          <p className="page-subtitle">Connect with expert counselors to guide your career journey</p>
        </section>

        <section className="counsellors-section">
          <div className="counsellors-grid">
            {counsellors.map(counsellor => (
              <Card key={counsellor.id} className="counsellor-card">
                <div className="counsellor-header">
                  <h3 className="counsellor-name">{counsellor.name}</h3>
                  <span className="counsellor-experience">{counsellor.experience} years experience</span>
                </div>
                <div className="counsellor-ratings">
                  {renderStars(counsellor.rating ?? 4.5)}
                  <span className="counsellor-rating-text">{counsellor.rating ?? 4.5}/5</span>
                  <span className="counsellor-sessions">({counsellor.totalSessions ?? 0} sessions)</span>
                </div>
                <p className="counsellor-bio">{counsellor.bio}</p>
                <div className="counsellor-expertise">
                  <strong>Expertise:</strong>
                  <div className="expertise-tags">
                    {counsellor.expertise.map((exp, idx) => (
                      <span key={idx} className="expertise-tag">{exp}</span>
                    ))}
                  </div>
                </div>
                <div className="counsellor-availability">
                  <strong>Availability:</strong> {counsellor.availability}
                </div>
                <button
                  className="btn btn-secondary schedule-btn"
                  onClick={() => handleScheduleClick(counsellor)}
                >
                  Book Session
                </button>
              </Card>
            ))}
          </div>
        </section>

        {selectedCounsellor && (
          <section className="scheduling-modal">
            <div className="modal-overlay" onClick={handleModalClose}></div>
            <div className="modal-content booking-modal">
              <div className="modal-header">
                <h2>Book Session with {selectedCounsellor.name}</h2>
                <button className="modal-close" onClick={handleModalClose}>×</button>
              </div>
              <div className="booking-steps-indicator">
                {BOOKING_STEPS.map((step, idx) => (
                  <div key={step} className={`step-dot ${idx <= bookingStep ? 'active' : ''}`}>
                    {idx + 1}
                  </div>
                ))}
              </div>
              <form onSubmit={handleFormSubmit} className="scheduling-form">
                {bookingError && (
                  <p className="page-subtitle" role="alert">{bookingError}</p>
                )}
                {BOOKING_STEPS[bookingStep] === 'date' && (
                  <div className="form-step">
                    <div className="form-group">
                      <label htmlFor="date">Select Date</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>
                )}
                {BOOKING_STEPS[bookingStep] === 'time' && (
                  <div className="form-step">
                    <div className="form-group">
                      <label>Select Time</label>
                      <div className="time-slots-grid">
                        {timeSlots.map(slot => (
                          <button
                            key={slot}
                            type="button"
                            className={`time-slot-btn ${formData.time === slot ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, time: slot })}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {BOOKING_STEPS[bookingStep] === 'session' && (
                  <div className="form-step">
                    <div className="form-group">
                      <label>Session Type</label>
                      <div className="session-types-list">
                        {sessionTypes.map(st => (
                          <button
                            key={st.id}
                            type="button"
                            className={`session-type-btn ${formData.sessionType === st.id ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, sessionType: st.id })}
                          >
                            <span className="session-type-label">{st.label}</span>
                            <span className="session-type-duration">{st.duration}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {BOOKING_STEPS[bookingStep] === 'confirm' && (
                  <div className="form-step">
                    <div className="form-group">
                      <label htmlFor="topic">Discussion Topic</label>
                      <textarea
                        id="topic"
                        name="topic"
                        value={formData.topic}
                        onChange={handleInputChange}
                        placeholder="What would you like to discuss?"
                        required
                        className="form-textarea"
                        rows="4"
                      />
                    </div>
                    <div className="booking-summary">
                      <h4>Booking Summary</h4>
                      <p><strong>Counsellor:</strong> {selectedCounsellor.name}</p>
                      <p><strong>Date:</strong> {formData.date}</p>
                      <p><strong>Time:</strong> {formData.time}</p>
                      <p><strong>Session:</strong> {sessionTypes.find(s => s.id === formData.sessionType)?.label}</p>
                    </div>
                  </div>
                )}
                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={bookingStep === 0 ? handleModalClose : handleBack}>
                    {bookingStep === 0 ? 'Cancel' : 'Back'}
                  </button>
                  {bookingStep < BOOKING_STEPS.length - 1 ? (
                    <button type="button" className="btn btn-secondary" onClick={handleNext} disabled={!canProceed()}>
                      Next
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-secondary" disabled={!canProceed()}>
                      Confirm Booking
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>
        )}
      </div>
    </div>
    </ProtectedBlur>
  );
}

export default Counseling;
