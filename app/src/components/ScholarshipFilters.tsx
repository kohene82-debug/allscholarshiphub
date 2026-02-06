import { useTranslation } from 'react-i18next';
import { MapPin, GraduationCap, BookOpen } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COUNTRIES, DEGREE_LEVELS, SUBJECTS } from '@/types/scholarship';
import type { FilterOptions } from '@/types/scholarship';

interface ScholarshipFiltersProps {
  filters: FilterOptions;
  onFilterChange: (key: keyof FilterOptions, value: string) => void;
}

export function ScholarshipFilters({ filters, onFilterChange }: ScholarshipFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Country Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          {t('filters.country')}
        </label>
        <Select
          value={filters.country}
          onValueChange={(value) => onFilterChange('country', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('filters.all')} />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {COUNTRIES.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Degree Level Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-slate-400" />
          {t('filters.degreeLevel')}
        </label>
        <Select
          value={filters.degreeLevel}
          onValueChange={(value) => onFilterChange('degreeLevel', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('filters.all')} />
          </SelectTrigger>
          <SelectContent>
            {DEGREE_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subject Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-slate-400" />
          {t('filters.subject')}
        </label>
        <Select
          value={filters.subject}
          onValueChange={(value) => onFilterChange('subject', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('filters.all')} />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {SUBJECTS.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
