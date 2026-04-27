import { createContext, useContext, useEffect, useState } from 'react';

const ComparisonContext = createContext();

export function ComparisonProvider({ children }) {
  const [compareCareers, setCompareCareers] = useState(() => {
    try {
      const stored = localStorage.getItem("compareCareers");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("compareCareers", JSON.stringify(compareCareers));
  }, [compareCareers]);

  const addToCompare = (career) => {
    setCompareCareers(prev => {
      if (prev.find(c => c.id === career.id)) return prev;
      if (prev.length >= 2) return prev; // max 2
      return [...prev, career];
    });
  };

  const removeFromCompare = (id) => {
    setCompareCareers(prev => prev.filter(c => c.id !== id));
  };

  const clearCompare = () => {
    setCompareCareers([]);
  };

  const isInCompare = (id) => {
    return compareCareers.some(c => c.id === id);
  };

  return (
    <ComparisonContext.Provider value={{ compareCareers, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider');
  }
  return context;
}
