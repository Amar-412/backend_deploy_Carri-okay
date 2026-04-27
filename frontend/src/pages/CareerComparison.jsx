import { Link } from 'react-router-dom';
import { useComparison } from '../contexts/ComparisonContext';
import Card from '../components/Card';
import './CareerComparison.css';

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

function CareerComparison() {
  const { compareCareers, clearCompare } = useComparison();

  if (compareCareers.length < 2) {
    return (
      <div className="career-comparison-page">
        <div className="container">
          <section className="comparison-header">
            <h1 className="page-title">Compare Careers</h1>
            <p className="page-subtitle">
              Select two careers from the Career Paths page to compare them side by side.
            </p>
            <Link to="/career-paths" className="btn btn-primary">Go to Career Paths</Link>
          </section>
        </div>
      </div>
    );
  }

  const [careerA, careerB] = compareCareers;

  const skillsAList = normalizeStringArray(careerA.requiredSkills);
  const skillsBList = normalizeStringArray(careerB.requiredSkills);

  const allSkills = [...new Set([...skillsAList, ...skillsBList])];

  const skillsA = new Set(skillsAList);
  const skillsB = new Set(skillsBList);

  const comparisonRows = [
    { label: 'Category', a: careerA.category, b: careerB.category },
    { label: 'Description', a: careerA.description, b: careerB.description },
    ...allSkills.map(skill => ({
      label: skill,
      a: skillsA.has(skill) ? '✓' : '—',
      b: skillsB.has(skill) ? '✓' : '—',
      isSkill: true
    }))
  ];

  return (
    <div className="career-comparison-page">
      <div className="container">
        <section className="comparison-header">
          <h1 className="page-title">Career Comparison</h1>
          <p className="page-subtitle">Side-by-side comparison of your selected careers</p>
          <button className="btn btn-outline" onClick={clearCompare}>Clear Comparison</button>
        </section>

        <section className="comparison-content">
          <Card className="comparison-table-card">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th className="comparison-label-col">Attribute</th>
                  <th>{careerA.title}</th>
                  <th>{careerB.title}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className={row.a !== row.b && row.label !== 'Description' ? 'diff-row' : ''}>
                    <td className="comparison-label-col">{row.label}</td>
                    <td>{row.a}</td>
                    <td>{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="comparison-actions">
              <Link to={`/career-paths/${careerA.id}`} className="btn btn-outline">View {careerA.title}</Link>
              <Link to={`/career-paths/${careerB.id}`} className="btn btn-outline">View {careerB.title}</Link>
              <button className="btn btn-primary" onClick={clearCompare}>Compare Different Careers</button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

export default CareerComparison;
