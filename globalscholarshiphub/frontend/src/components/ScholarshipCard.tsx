import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, GraduationCap, BookOpen, ExternalLink, Award } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Scholarship } from '@/types/scholarship';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  onClick?: () => void;
  featured?: boolean;
}

export function ScholarshipCard({ scholarship, onClick, featured = false }: ScholarshipCardProps) {
  const { t, i18n } = useTranslation();

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('scholarship.noDeadlines');
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysLeft = (dateString?: string) => {
    if (!dateString) return null;
    const deadline = new Date(dateString);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysLeft(scholarship.deadline);

  return (
    <Card 
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer border-0 shadow-md ${
        featured ? 'ring-2 ring-amber-400/50' : ''
      }`}
      onClick={onClick}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-amber-500 text-white border-0">
            <Award className="w-3 h-3 mr-1" />
            {t('scholarship.featured')}
          </Badge>
        </div>
      )}

      {/* Urgency Badge */}
      {daysLeft !== null && daysLeft <= 30 && daysLeft > 0 && (
        <div className={`absolute top-4 ${featured ? 'right-32' : 'right-4'} z-10`}>
          <Badge className="bg-red-500 text-white border-0 animate-pulse">
            {daysLeft} {t('scholarship.deadline').toLowerCase()}
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        {/* Provider */}
        {scholarship.provider && (
          <p className="text-sm text-slate-500 mb-2 line-clamp-1">
            {scholarship.provider}
          </p>
        )}
        
        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {scholarship.name}
        </h3>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Description */}
        {scholarship.description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {scholarship.description}
          </p>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Amount */}
          {scholarship.amount && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{t('scholarship.amount')}</p>
                <p className="font-medium text-slate-900 line-clamp-1">{scholarship.amount}</p>
              </div>
            </div>
          )}

          {/* Deadline */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{t('scholarship.deadline')}</p>
              <p className={`font-medium line-clamp-1 ${
                daysLeft !== null && daysLeft <= 7 ? 'text-red-600' : 'text-slate-900'
              }`}>
                {formatDate(scholarship.deadline)}
              </p>
            </div>
          </div>

          {/* Country */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{t('scholarship.country')}</p>
              <p className="font-medium text-slate-900 line-clamp-1">{scholarship.country}</p>
            </div>
          </div>

          {/* Degree Level */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{t('scholarship.degree')}</p>
              <p className="font-medium text-slate-900 line-clamp-1">{scholarship.degree_level}</p>
            </div>
          </div>
        </div>

        {/* Subject */}
        {scholarship.subject && scholarship.subject !== 'Any' && (
          <div className="flex items-center gap-2 text-sm mb-4">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">{scholarship.subject}</span>
          </div>
        )}

        {/* Apply Button */}
        {scholarship.application_link && (
          <Button 
            variant="default" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              window.open(scholarship.application_link, '_blank');
            }}
          >
            {t('scholarship.applyNow')}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
