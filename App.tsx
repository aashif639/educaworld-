
import React, { useState, useMemo, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { InstitutionsProvider, useInstitutions } from './contexts/InstitutionsContext';
import { Institution } from './types';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import InstitutionTable from './components/InstitutionTable';
import InstitutionDetailsModal from './components/InstitutionDetailsModal';
import InstitutionFormModal from './components/InstitutionFormModal';
import Login from './components/Login';
import { PlusIcon } from './components/Icons';

type View = 'list' | 'login';

const AppContent: React.FC = () => {
    const { user } = useAuth();
    const { institutions, deleteInstitution } = useInstitutions();
    
    const [view, setView] = useState<View>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
    const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const filteredInstitutions = useMemo(() => {
        if (!searchTerm) return institutions;
        const lowercasedTerm = searchTerm.toLowerCase();
        return institutions.filter(inst =>
            inst.name.toLowerCase().includes(lowercasedTerm) ||
            inst.location.toLowerCase().includes(lowercasedTerm) ||
            inst.courses.some(course => course.toLowerCase().includes(lowercasedTerm))
        );
    }, [institutions, searchTerm]);
    
    const handleLoginClick = () => setView('login');
    const handleLoginSuccess = () => setView('list');

    const handleSelectInstitution = useCallback((institution: Institution) => {
        setSelectedInstitution(institution);
    }, []);

    const handleCloseDetails = useCallback(() => {
        setSelectedInstitution(null);
    }, []);

    const handleAddNew = () => {
        setEditingInstitution(null);
        setIsFormOpen(true);
    };

    const handleEdit = useCallback((institution: Institution) => {
        setEditingInstitution(institution);
        setIsFormOpen(true);
    }, []);

    const handleDelete = useCallback((id: string) => {
        if (window.confirm('Are you sure you want to delete this institution?')) {
            deleteInstitution(id);
        }
    }, [deleteInstitution]);

    const handleCloseForm = useCallback(() => {
        setIsFormOpen(false);
        setEditingInstitution(null);
    }, []);
    
    if (!user && view === 'login') {
        return (
            <>
                <Header onLoginClick={handleLoginClick} />
                <main className="container mx-auto px-6 py-8">
                    <Login onLoginSuccess={handleLoginSuccess} />
                </main>
            </>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header onLoginClick={handleLoginClick} />
            <main className="container mx-auto px-6 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="w-full sm:w-2/3 lg:w-1/2">
                        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                    </div>
                    {user && (
                        <button 
                          onClick={handleAddNew}
                          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Institution
                        </button>
                    )}
                </div>

                <InstitutionTable
                    institutions={filteredInstitutions}
                    onSelect={handleSelectInstitution}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </main>

            <InstitutionDetailsModal 
                institution={selectedInstitution} 
                onClose={handleCloseDetails}
            />

            <InstitutionFormModal
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                institutionToEdit={editingInstitution}
            />
        </div>
    );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <InstitutionsProvider>
        <AppContent />
      </InstitutionsProvider>
    </AuthProvider>
  );
};

export default App;
