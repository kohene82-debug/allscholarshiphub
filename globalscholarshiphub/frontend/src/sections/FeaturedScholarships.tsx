import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScholarshipCard } from '@/components/ScholarshipCard';
import type { Scholarship } from '@/types/scholarship';

interface FeaturedScholarshipsProps {
  scholarships: Scholarship[];
  onViewChange: (view: string) => void;
  onSelectScholarship: (scholarship: Scholarship) => void;
}

// Sample featured scholarships data
const sampleFeaturedScholarships: Scholarship[] = [
  {
    id: 1,
    name: 'Fulbright Foreign Student Program',
    provider: 'U.S. Department of State',
    description: 'The Fulbright Foreign Student Program enables graduate students, young professionals, and artists from abroad to study and conduct research in the United States.',
    amount: 'Full Funding',
    currency: 'USD',
    deadline: '2024-10-15',
    country: 'USA',
    degree_level: 'Master',
    subject: 'Any',
    is_featured: true,
    application_link: 'https://foreign.fulbrightonline.org/',
    source_name: 'sample'
  },
  {
    id: 2,
    name: 'Chevening Scholarships',
    provider: 'UK Foreign, Commonwealth & Development Office',
    description: 'Chevening Scholarships are the UK government\'s global scholarship program, funded by the Foreign, Commonwealth & Development Office.',
    amount: 'Full Funding',
    currency: 'GBP',
    deadline: '2024-11-05',
    country: 'UK',
    degree_level: 'Master',
    subject: 'Any',
    is_featured: true,
    application_link: 'https://www.chevening.org/',
    source_name: 'sample'
  },
  {
    id: 3,
    name: 'Erasmus Mundus Joint Masters',
    provider: 'European Union',
    description: 'Erasmus Mundus Joint Masters are delivered by multiple higher education institutions and include study periods in different countries.',
    amount: '€1,400/month',
    currency: 'EUR',
    deadline: '2024-12-15',
    country: 'Europe',
    degree_level: 'Master',
    subject: 'Any',
    is_featured: true,
    application_link: 'https://erasmus-plus.ec.europa.eu/',
    source_name: 'sample'
  },
  {
    id: 4,
    name: 'DAAD Scholarships',
    provider: 'German Academic Exchange Service',
    description: 'DAAD scholarships offer graduates the opportunity to continue their education in Germany with a postgraduate or continuing course of study.',
    amount: '€850-1,200/month',
    currency: 'EUR',
    deadline: '2024-10-31',
    country: 'Germany',
    degree_level: 'Master',
    subject: 'Any',
    is_featured: true,
    application_link: 'https://www.daad.de/',
    source_name: 'sample'
  },
  {
    id: 5,
    name: 'Australia Awards Scholarships',
    provider: 'Australian Government',
    description: 'Australia Awards Scholarships are long-term awards administered by the Department of Foreign Affairs and Trade.',
    amount: 'Full Funding',
    currency: 'AUD',
    deadline: '2024-04-30',
    country: 'Australia',
    degree_level: 'Any',
    subject: 'Any',
    is_featured: true,
    application_link: 'https://www.dfat.gov.au/',
    source_name: 'sample'
  },
  {
    id: 6,
    name: 'Gates Cambridge Scholarship',
    provider: 'Bill & Melinda Gates Foundation',
    description: 'Gates Cambridge Scholarships are awarded to outstanding applicants from countries outside the UK to pursue a full-time postgraduate degree.',
    amount: 'Full Funding',
    currency: 'GBP',
    deadline: '2024-12-05',
    country: 'UK',
    degree_level: 'PhD',
    subject: 'Any',
    is_featured: true,
    application_link: 'https://www.gatescambridge.org/',
    source_name: 'sample'
  }
];

export function FeaturedScholarships({ 
  scholarships, 
  onViewChange, 
  onSelectScholarship 
}: FeaturedScholarshipsProps) {
  const { t } = useTranslation();
  
  const displayScholarships = scholarships.length > 0 
    ? scholarships.filter(s => s.is_featured).slice(0, 6)
    : sampleFeaturedScholarships;

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            {t('scholarship.featured')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            {t('featured.title')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('featured.subtitle')}
          </p>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {displayScholarships.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
              onClick={() => onSelectScholarship(scholarship)}
              featured
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            onClick={() => onViewChange('scholarships')}
            variant="outline"
            size="lg"
            className="group border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            {t('featured.viewAll')}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
