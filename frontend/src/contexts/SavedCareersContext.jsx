import { createContext, useContext, useState } from 'react';

const SavedCareersContext = createContext();

export function SavedCareersProvider({ children }) {
  const [savedCareerIds, setSavedCareerIds] = useState(new Set());

  const toggleSaved = (careerId) => {
    setSavedCareerIds(prev => {
      const next = new Set(prev);
      if (next.has(careerId)) {
        next.delete(careerId);
      } else {
        next.add(careerId);
      }
      return next;
    });
  };

  const isSaved = (careerId) => savedCareerIds.has(careerId);

  return (
    <SavedCareersContext.Provider value={{ savedCareerIds, toggleSaved, isSaved }}>
      {children}
    </SavedCareersContext.Provider>
  );
}

export function useSavedCareers() {
  const context = useContext(SavedCareersContext);
  if (!context) {
    throw new Error('useSavedCareers must be used within SavedCareersProvider');
  }
  return context;
}
