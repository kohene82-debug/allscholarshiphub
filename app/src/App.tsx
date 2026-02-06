import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';
import { Navigation } from './sections/Navigation';
import { Hero } from './sections/Hero';
import { FeaturedScholarships } from './sections/FeaturedScholarships';
import { ScholarshipList } from './sections/ScholarshipList';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';
import { ScholarshipModal } from './components/ScholarshipModal';
import { Toaster } from '@/components/ui/sonner';
import type { Scholarship } from './types/scholarship';
import './App.css';

function App() {
  const { i18n } = useTranslation();
  const [currentView, setCurrentView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Set document direction based on language
  useEffect(() => {
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  // Fetch scholarships from API (simulated)
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        // In production, this would be a real API call
        // const response = await fetch('/api/scholarships');
        // const data = await response.json();
        // setScholarships(data);
        
        // For now, we'll use the sample data in components
        setScholarships([]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching scholarships:', error);
        setIsLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView('scholarships');
  };

  const handleSelectScholarship = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedScholarship(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <Hero onSearch={handleSearch} onViewChange={setCurrentView} />
            <FeaturedScholarships
              scholarships={scholarships}
              onViewChange={setCurrentView}
              onSelectScholarship={handleSelectScholarship}
            />
          </>
        );
      
      case 'scholarships':
        return (
          <ScholarshipList
            scholarships={scholarships}
            onSelectScholarship={handleSelectScholarship}
            initialSearchQuery={searchQuery}
          />
        );
      
      case 'featured':
        return (
          <div className="pt-8">
            <FeaturedScholarships
              scholarships={scholarships}
              onViewChange={setCurrentView}
              onSelectScholarship={handleSelectScholarship}
            />
          </div>
        );
      
      case 'contact':
        return <Contact />;
      
      default:
        return (
          <>
            <Hero onSearch={handleSearch} onViewChange={setCurrentView} />
            <FeaturedScholarships
              scholarships={scholarships}
              onViewChange={setCurrentView}
              onSelectScholarship={handleSelectScholarship}
            />
          </>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1">
        {renderContent()}
      </main>

      <Footer onViewChange={setCurrentView} />

      {/* Scholarship Detail Modal */}
      <ScholarshipModal
        scholarship={selectedScholarship}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Toast notifications */}
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
