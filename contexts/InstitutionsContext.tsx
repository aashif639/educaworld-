
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Institution } from '../types';
import { INITIAL_INSTITUTIONS } from '../constants';

interface InstitutionsContextType {
  institutions: Institution[];
  addInstitution: (institution: Omit<Institution, 'id'>) => void;
  updateInstitution: (institution: Institution) => void;
  deleteInstitution: (id: string) => void;
}

const InstitutionsContext = createContext<InstitutionsContextType | undefined>(undefined);

export const InstitutionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [institutions, setInstitutions] = useState<Institution[]>(INITIAL_INSTITUTIONS);

  const addInstitution = useCallback((institutionData: Omit<Institution, 'id'>) => {
    const newInstitution: Institution = {
      ...institutionData,
      id: new Date().toISOString(),
    };
    setInstitutions(prev => [newInstitution, ...prev]);
  }, []);

  const updateInstitution = useCallback((updatedInstitution: Institution) => {
    setInstitutions(prev => prev.map(inst => inst.id === updatedInstitution.id ? updatedInstitution : inst));
  }, []);

  const deleteInstitution = useCallback((id: string) => {
    setInstitutions(prev => prev.filter(inst => inst.id !== id));
  }, []);

  return (
    <InstitutionsContext.Provider value={{ institutions, addInstitution, updateInstitution, deleteInstitution }}>
      {children}
    </InstitutionsContext.Provider>
  );
};

export const useInstitutions = (): InstitutionsContextType => {
  const context = useContext(InstitutionsContext);
  if (context === undefined) {
    throw new Error('useInstitutions must be used within an InstitutionsProvider');
  }
  return context;
};
