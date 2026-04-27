import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { quizQuestions } from '../data/quizData';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import ProtectedBlur from '../components/ProtectedBlur';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import './CareerQuiz.css';

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

function CareerQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [careers, setCareers] = useState([]);
  const { currentUser, token, logout } = useAuth();
  const currentUserId = getUserId(currentUser);

  useEffect(() => {
    fetchWithAuth("http://localhost:8080/api/careers", {}, token)
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
      .catch(err => console.error(err));
  }, [token, logout]);

  const question = quizQuestions[currentStep];
  const isLastStep = currentStep === quizQuestions.length - 1;

  const handleAnswer = (value) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }));
  };

  const handleNext = () => {
    if (isLastStep) {
      const results = calculateResults();

      // send to backend ONLY if user logged in
      if (currentUserId && results.length > 0) {
        const careerIds = results.map(r => r.id);

        fetchWithAuth("http://localhost:8080/api/quiz", {
          method: "POST",
          body: JSON.stringify({
            careerIds: careerIds
          })
        }, token)
          .then(res => {
            if (res.status === 401) {
              logout();
              throw new Error('Unauthorized');
            }
            if (!res.ok) {
              throw new Error('Failed to save quiz');
            }
            return res.json();
          })
          .then(data => {
            console.log("Quiz saved:", data);
          })
          .catch(err => console.error("Quiz save error:", err));
      }

      setShowResults(true);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    if (careers.length === 0) return [];

    const careerScores = {};
    quizQuestions.forEach((q) => {
      const selectedValue = answers[q.id];
      if (!selectedValue) return;
      const selectedOption = q.options.find(o => o.value === selectedValue);
      if (selectedOption?.careers) {
        selectedOption.careers.forEach(title => {
          careerScores[title] = (careerScores[title] || 0) + 1;
        });
      }
    });

    const sorted = Object.entries(careerScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([title, score]) => {
        const career = careers.find(c => c.title === title);
        return career ? { ...career, matchScore: Math.min(score * 20 + 60, 98) } : null;
      })
      .filter(Boolean);

    return sorted.length > 0 ? sorted : careers.slice(0, 3).map((c, i) => ({
      ...c,
      matchScore: 85 - i * 5
    }));
  };

  const results = showResults ? calculateResults() : [];

  if (showResults) {
    return (
      <ProtectedBlur>
      <div className="career-quiz-page">
        <div className="container">
          <section className="quiz-header">
            <h1 className="page-title">Your Career Recommendations</h1>
            <p className="page-subtitle">Based on your quiz responses, here are careers that match your interests</p>
          </section>
          <section className="quiz-results">
            <div className="results-grid">
              {results.map((career) => (
                <Card key={career.id} className="quiz-result-card">
                  <div className="result-card-header">
                    <h3 className="result-card-title">{career.title}</h3>
                    <span className="match-badge">{career.matchScore}% Match</span>
                  </div>
                  <p className="result-card-description">{career.description}</p>
                  <div className="result-card-skills">
                    <strong>Key Skills:</strong>
                    <div className="skills-tags">
                      {normalizeStringArray(career.requiredSkills).slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <Link to={`/career-paths/${career.id}`} className="btn btn-secondary result-btn">
                    View Details
                  </Link>
                </Card>
              ))}
            </div>
            <div className="quiz-actions">
              <button className="btn btn-outline" onClick={() => { setShowResults(false); setCurrentStep(0); setAnswers({}); }}>
                Retake Quiz
              </button>
              <Link to="/career-paths" className="btn btn-primary">Explore All Careers</Link>
            </div>
          </section>
        </div>
      </div>
      </ProtectedBlur>
    );
  }

  return (
    <ProtectedBlur>
    <div className="career-quiz-page">
      <div className="container">
        <section className="quiz-header">
          <h1 className="page-title">Career Assessment Quiz</h1>
          <p className="page-subtitle">Answer a few questions to discover careers that match your interests</p>
          <div className="quiz-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
            <span className="progress-text">Step {currentStep + 1} of {quizQuestions.length}</span>
          </div>
        </section>

        <section className="quiz-content">
          <Card className="quiz-question-card">
            <h2 className="question-text">{question.question}</h2>
            <div className="options-list">
              {question.options.map((opt) => (
                <button
                  key={opt.value}
                  className={`option-btn ${answers[question.id] === opt.value ? 'active' : ''}`}
                  onClick={() => handleAnswer(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="quiz-navigation">
              <button
                className="btn btn-outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                Back
              </button>
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={!answers[question.id]}
              >
                {isLastStep ? 'See Results' : 'Next'}
              </button>
            </div>
          </Card>
        </section>
      </div>
    </div>
    </ProtectedBlur>
  );
}

export default CareerQuiz;
  