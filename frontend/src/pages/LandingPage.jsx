import { Link } from 'react-router-dom';
import { testimonials } from '../data/testimonials';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Navigate Your Career Journey with Confidence</h1>
          <p className="hero-description">
            Discover your ideal career path, connect with expert counselors, and unlock your professional potential.
          </p>
          <div className="hero-cta">
            <Link to="/career-paths" className="btn btn-primary">Explore Career Paths</Link>
            <Link to="/counseling" className="btn btn-outline">Book a Session</Link>
          </div>
        </div>
      </section>

      <section className="features section">
        <div className="container">
          <h2 className="section-title">Why Choose Carri-Okay?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Career Path Exploration</h3>
              <p className="feature-description">
                Explore diverse career options tailored to your interests, skills, and aspirations.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3 className="feature-title">Expert Mentorship</h3>
              <p className="feature-description">
                Connect with experienced counselors who guide you through every step of your career journey.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3 className="feature-title">Skill-Based Guidance</h3>
              <p className="feature-description">
                Identify and develop the skills needed to succeed in your chosen career path.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials section">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-rating">
                  {'★'.repeat(testimonial.rating)}
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;

