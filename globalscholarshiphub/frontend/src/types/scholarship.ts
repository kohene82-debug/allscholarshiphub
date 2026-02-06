export interface Scholarship {
  id: number;
  name: string;
  description?: string;
  provider?: string;
  eligibility?: string;
  amount?: string;
  currency?: string;
  deadline?: string;
  application_link?: string;
  country: string;
  degree_level: string;
  subject: string;
  is_featured?: boolean;
  source_name?: string;
  created_at?: string;
}

export interface FilterOptions {
  country: string;
  degreeLevel: string;
  subject: string;
  searchQuery: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  isRTL: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export const COUNTRIES = [
  'All',
  'International',
  'USA',
  'UK',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Switzerland',
  'Austria',
  'Belgium',
  'Italy',
  'Spain',
  'Japan',
  'South Korea',
  'China',
  'Singapore',
  'New Zealand',
  'Ireland',
  'Finland',
  'Poland',
  'Czech Republic',
  'Hungary',
  'Portugal',
  'Greece',
  'Turkey',
  'UAE',
  'Saudi Arabia',
  'Qatar',
  'Malaysia',
  'Thailand',
  'India',
  'South Africa',
  'Ghana',
  'Nigeria',
  'Kenya',
  'Egypt',
  'Morocco',
  'Brazil',
  'Mexico',
  'Argentina',
  'Chile',
  'Colombia',
];

export const DEGREE_LEVELS = [
  'All',
  'High School',
  'Bachelor',
  'Master',
  'PhD',
  'Postdoctoral',
  'Any',
];

export const SUBJECTS = [
  'All',
  'Any',
  'Engineering',
  'Computer Science',
  'Medicine',
  'Business',
  'Economics',
  'Law',
  'Science',
  'Mathematics',
  'Arts',
  'Humanities',
  'Social Sciences',
  'Education',
  'Agriculture',
  'Environmental Science',
  'Architecture',
  'Design',
  'Journalism',
  'Psychology',
  'Political Science',
  'International Relations',
  'Public Health',
  'Nursing',
  'Pharmacy',
  'Dentistry',
  'Veterinary Medicine',
  'Music',
  'Film',
  'Theater',
  'Sports',
];

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', isRTL: false },
  { code: 'fr', name: 'French', nativeName: 'Français', isRTL: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', isRTL: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', isRTL: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true },
  { code: 'zh', name: 'Chinese', nativeName: '中文', isRTL: false },
];
