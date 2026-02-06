import { useTranslation } from 'react-i18next';
import { GraduationCap, Mail, Phone, Facebook, Twitter, Instagram, Linkedin, Youtube, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface FooterProps {
  onViewChange: (view: string) => void;
}

export function Footer({ onViewChange }: FooterProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const quickLinks = [
    { key: 'home', label: t('nav.home') },
    { key: 'scholarships', label: t('nav.scholarships') },
    { key: 'featured', label: t('nav.featured') },
    { key: 'contact', label: t('nav.contact') },
  ];

  const resources = [
    { label: 'Scholarship Guide', href: '#' },
    { label: 'Application Tips', href: '#' },
    { label: 'Essay Writing', href: '#' },
    { label: 'Interview Prep', href: '#' },
    { label: 'Success Stories', href: '#' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div 
              className="flex items-center gap-2 mb-6 cursor-pointer"
              onClick={() => onViewChange('home')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                ASH
              </span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              {t('footer.tagline')}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <button
                    onClick={() => onViewChange(link.key)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              {t('footer.resources')}
            </h3>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource.label}>
                  <a
                    href={resource.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {resource.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              {t('footer.newsletter.title')}
            </h3>
            <p className="text-slate-400 mb-4">
              Get the latest scholarship updates delivered to your inbox.
            </p>
            
            {subscribed ? (
              <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400">
                {t('footer.newsletter.success')}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder={t('footer.newsletter.placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                  <Button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-blue-500" />
                <span>+233 549 307 901</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-blue-500" />
                <span>+86 132 5569 6140</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>info@allscholarshipshub.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} All Scholarships Hub. {t('footer.rights')}.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                {t('footer.privacy')}
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                {t('footer.terms')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
