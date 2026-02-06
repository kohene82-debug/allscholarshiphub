import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LANGUAGES } from '@/types/scholarship';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    document.dir = langCode === 'ar' ? 'rtl' : 'ltr';
  };

  const navItems = [
    { key: 'home', label: t('nav.home') },
    { key: 'scholarships', label: t('nav.scholarships') },
    { key: 'featured', label: t('nav.featured') },
    { key: 'contact', label: t('nav.contact') },
  ];

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onViewChange('home')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              ASH
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.key}
                variant={currentView === item.key ? 'default' : 'ghost'}
                onClick={() => onViewChange(item.key)}
                className={currentView === item.key 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Language Selector */}
          <div className="hidden md:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-slate-600">
                  <Globe className="w-4 h-4" />
                  <span>{currentLang.nativeName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {LANGUAGES.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={i18n.language === lang.code ? 'bg-blue-50 text-blue-600' : ''}
                  >
                    <span className="flex-1">{lang.nativeName}</span>
                    {i18n.language === lang.code && (
                      <span className="text-xs text-blue-600">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.key}
                  variant={currentView === item.key ? 'default' : 'ghost'}
                  onClick={() => {
                    onViewChange(item.key);
                    setIsMobileMenuOpen(false);
                  }}
                  className={currentView === item.key 
                    ? 'bg-blue-600 text-white justify-start' 
                    : 'text-slate-600 justify-start'
                  }
                >
                  {item.label}
                </Button>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500 px-4 py-2">{t('language.select')}</p>
                <div className="grid grid-cols-2 gap-2 px-2">
                  {LANGUAGES.map((lang) => (
                    <Button
                      key={lang.code}
                      variant="ghost"
                      size="sm"
                      onClick={() => changeLanguage(lang.code)}
                      className={i18n.language === lang.code ? 'bg-blue-50 text-blue-600' : ''}
                    >
                      {lang.nativeName}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
