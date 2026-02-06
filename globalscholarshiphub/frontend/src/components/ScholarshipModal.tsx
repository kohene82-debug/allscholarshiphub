import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, GraduationCap, BookOpen, Award, ExternalLink, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Scholarship } from '@/types/scholarship';

interface ScholarshipModalProps {
  scholarship: Scholarship | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ScholarshipModal({ scholarship, isOpen, onClose }: ScholarshipModalProps) {
  const { t, i18n } = useTranslation();

  if (!scholarship) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('scholarship.noDeadlines');
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'long',
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {scholarship.is_featured && (
                  <Badge className="mb-3 bg-amber-400 text-amber-900 border-0">
                    {t('scholarship.featured')}
                  </Badge>
                )}
                <DialogTitle className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {scholarship.name}
                </DialogTitle>
                {scholarship.provider && (
                  <p className="mt-2 text-blue-100 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {scholarship.provider}
                  </p>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {scholarship.amount && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Award className="w-5 h-5 text-amber-300 mb-2" />
                <p className="text-xs text-blue-200">{t('scholarship.amount')}</p>
                <p className="font-semibold">{scholarship.amount}</p>
              </div>
            )}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Calendar className="w-5 h-5 text-blue-200 mb-2" />
              <p className="text-xs text-blue-200">{t('scholarship.deadline')}</p>
              <p className={`font-semibold ${daysLeft !== null && daysLeft <= 7 ? 'text-red-300' : ''}`}>
                {formatDate(scholarship.deadline)}
              </p>
              {daysLeft !== null && daysLeft > 0 && (
                <p className={`text-xs mt-1 ${daysLeft <= 7 ? 'text-red-300' : 'text-blue-200'}`}>
                  {daysLeft} days left
                </p>
              )}
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <MapPin className="w-5 h-5 text-green-300 mb-2" />
              <p className="text-xs text-blue-200">{t('scholarship.country')}</p>
              <p className="font-semibold">{scholarship.country}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <GraduationCap className="w-5 h-5 text-purple-300 mb-2" />
              <p className="text-xs text-blue-200">{t('scholarship.degree')}</p>
              <p className="font-semibold">{scholarship.degree_level}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Description */}
          {scholarship.description && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">About</h3>
              <p className="text-slate-600 leading-relaxed">
                {scholarship.description}
              </p>
            </div>
          )}

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Subject */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">{t('scholarship.subject')}</p>
                <p className="font-medium text-slate-900">{scholarship.subject}</p>
              </div>
            </div>

            {/* Eligibility */}
            {scholarship.eligibility && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{t('scholarship.eligibility')}</p>
                  <p className="font-medium text-slate-900">{scholarship.eligibility}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Source */}
          {scholarship.source_name && (
            <div className="text-sm text-slate-500">
              Source: <span className="text-slate-700">{scholarship.source_name}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {scholarship.application_link && (
              <Button
                size="lg"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => window.open(scholarship.application_link, '_blank')}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                {t('scholarship.applyNow')}
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              onClick={onClose}
              className="flex-1 sm:flex-none"
            >
              {t('scholarship.learnMore')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
