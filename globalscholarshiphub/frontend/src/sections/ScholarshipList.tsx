import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScholarshipCard } from '@/components/ScholarshipCard';
import { ScholarshipFilters } from '@/components/ScholarshipFilters';
import type { Scholarship, FilterOptions } from '@/types/scholarship';

interface ScholarshipListProps {
  scholarships: Scholarship[];
  onSelectScholarship: (scholarship: Scholarship) => void;
  initialSearchQuery?: string;
}

// Extended sample data
const sampleScholarships: Scholarship[] = [
  {
    id: 1,
    name: 'Fulbright Foreign Student Program',
    provider: 'U.S. Department of State',
    description: 'The Fulbright Foreign Student Program enables graduate students, young professionals, and artists from abroad to study and conduct research in the United States.',
    amount: 'Full Funding',
    deadline: '2024-10-15',
    country: 'USA',
    degree_level: 'Master',
    subject: 'Any',
    is_featured: true,
    application_link: 'https://foreign.fulbrightonline.org/'
  },
  {
    id: 2,
    name: 'Chevening Scholarships',
    provider: 'UK Government',
    description: 'Chevening Scholarships are the UK government\'s global scholarship program.',
    amount: 'Full Funding',
    deadline: '2024-11-05',
    country: 'UK',
    degree_level: 'Master',
    subject: 'Any',
    is_featured: true,
    application_link: 'https://www.chevening.org/'
  },
  {
    id: 3,
    name: 'Erasmus Mundus Joint Masters',
    provider: 'European Union',
    description: 'Erasmus Mundus Joint Masters are delivered by multiple higher education institutions.',
    amount: '€1,400/month',
    deadline: '2024-12-15',
    country: 'Europe',
    degree_level: 'Master',
    subject: 'Any',
    is_featured: true,
    application_link: 'https://erasmus-plus.ec.europa.eu/'
  },
  {
    id: 4,
    name: 'DAAD Scholarships',
    provider: 'German Academic Exchange Service',
    description: 'DAAD scholarships offer graduates the opportunity to continue their education in Germany.',
    amount: '€850-1,200/month',
    deadline: '2024-10-31',
    country: 'Germany',
    degree_level: 'Master',
    subject: 'Any',
    is_featured: true,
    application_link: 'https://www.daad.de/'
  },
  {
    id: 5,
    name: 'Australia Awards Scholarships',
    provider: 'Australian Government',
    description: 'Long-term awards administered by the Department of Foreign Affairs and Trade.',
    amount: 'Full Funding',
    deadline: '2024-04-30',
    country: 'Australia',
    degree_level: 'Any',
    subject: 'Any',
    is_featured: true,
    application_link: 'https://www.dfat.gov.au/'
  },
  {
    id: 6,
    name: 'Gates Cambridge Scholarship',
    provider: 'Bill & Melinda Gates Foundation',
    description: 'Awarded to outstanding applicants from countries outside the UK.',
    amount: 'Full Funding',
    deadline: '2024-12-05',
    country: 'UK',
    degree_level: 'PhD',
    subject: 'Any',
    is_featured: true,
    application_link: 'https://www.gatescambridge.org/'
  },
  {
    id: 7,
    name: 'ETH Excellence Scholarships',
    provider: 'ETH Zurich',
    description: 'Excellence Scholarships for outstanding students wishing to pursue a Master\'s degree at ETH Zurich.',
    amount: 'CHF 12,000/semester',
    deadline: '2024-12-15',
    country: 'Switzerland',
    degree_level: 'Master',
    subject: 'Engineering',
    application_link: 'https://ethz.ch/'
  },
  {
    id: 8,
    name: 'Swedish Institute Scholarships',
    provider: 'Swedish Institute',
    description: 'The Swedish Institute Scholarships for Global Professionals.',
    amount: 'Full Funding',
    deadline: '2024-02-28',
    country: 'Sweden',
    degree_level: 'Master',
    subject: 'Any',
    application_link: 'https://si.se/'
  },
  {
    id: 9,
    name: 'Holland Scholarship',
    provider: 'Dutch Ministry of Education',
    description: 'Scholarship for international students from outside the EEA.',
    amount: '€5,000',
    deadline: '2024-05-01',
    country: 'Netherlands',
    degree_level: 'Bachelor',
    subject: 'Any',
    application_link: 'https://www.studyinholland.nl/'
  },
  {
    id: 10,
    name: 'Eiffel Excellence Scholarship',
    provider: 'French Ministry for Europe and Foreign Affairs',
    description: 'The Eiffel Excellence Scholarship Programme aims to attract top foreign students.',
    amount: '€1,181/month',
    deadline: '2024-01-10',
    country: 'France',
    degree_level: 'Master',
    subject: 'Any',
    application_link: 'https://www.campusfrance.org/'
  },
  {
    id: 11,
    name: 'Japanese Government Scholarship',
    provider: 'MEXT Japan',
    description: 'Japanese Government (MEXT) Scholarship for international students.',
    amount: 'Full Funding',
    deadline: '2024-05-31',
    country: 'Japan',
    degree_level: 'Any',
    subject: 'Any',
    application_link: 'https://www.mext.go.jp/'
  },
  {
    id: 12,
    name: 'Korean Government Scholarship',
    provider: 'NIIED Korea',
    description: 'Global Korea Scholarship for international students.',
    amount: 'Full Funding',
    deadline: '2024-03-31',
    country: 'South Korea',
    degree_level: 'Any',
    subject: 'Any',
    application_link: 'https://www.studyinkorea.go.kr/'
  }
];

export function ScholarshipList({ 
  scholarships, 
  onSelectScholarship,
  initialSearchQuery = '' 
}: ScholarshipListProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    country: 'All',
    degreeLevel: 'All',
    subject: 'All',
    searchQuery: initialSearchQuery
  });

  const displayScholarships = scholarships.length > 0 ? scholarships : sampleScholarships;

  const filteredScholarships = useMemo(() => {
    return displayScholarships.filter((scholarship) => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          scholarship.name.toLowerCase().includes(query) ||
          (scholarship.description?.toLowerCase().includes(query) ?? false) ||
          (scholarship.provider?.toLowerCase().includes(query) ?? false) ||
          scholarship.country.toLowerCase().includes(query) ||
          scholarship.subject.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Country filter
      if (filters.country !== 'All' && scholarship.country !== filters.country) {
        return false;
      }

      // Degree level filter
      if (filters.degreeLevel !== 'All' && scholarship.degree_level !== filters.degreeLevel) {
        return false;
      }

      // Subject filter
      if (filters.subject !== 'All' && scholarship.subject !== filters.subject) {
        return false;
      }

      return true;
    });
  }, [displayScholarships, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, searchQuery }));
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      country: 'All',
      degreeLevel: 'All',
      subject: 'All',
      searchQuery: ''
    });
    setSearchQuery('');
  };

  const hasActiveFilters = 
    filters.country !== 'All' || 
    filters.degreeLevel !== 'All' || 
    filters.subject !== 'All' ||
    filters.searchQuery !== '';

  return (
    <section className="py-12 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            {t('nav.scholarships')}
          </h1>
          <p className="text-slate-600">
            {filteredScholarships.length} {t('hero.stats.scholarships').toLowerCase()} found
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 h-12 border-slate-200 rounded-xl"
                />
              </div>
            </form>

            {/* Filter Toggle Button */}
            <Button
              variant={showFilters ? 'default' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className={`h-12 px-6 ${showFilters ? 'bg-blue-600' : 'border-slate-200'}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              {t('filters.title')}
              {hasActiveFilters && (
                <span className="ml-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                 !
                </span>
              )}
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <ScholarshipFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-slate-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4 mr-1" />
                    {t('filters.reset')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Grid */}
        {filteredScholarships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                onClick={() => onSelectScholarship(scholarship)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {t('noResults')}
            </h3>
            <p className="text-slate-600 mb-6">{t('tryAgain')}</p>
            <Button onClick={clearFilters} variant="outline">
              {t('filters.reset')}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
