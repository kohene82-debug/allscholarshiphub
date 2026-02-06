import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, Clock, Send, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';


export function Contact() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t('contact.info.phone'),
      items: [
        { label: 'Ghana', value: '+233 549 307 901' },
        { label: 'China', value: '+86 132 5569 6140' }
      ] as { label: string; value: string }[]
    },
    {
      icon: Mail,
      title: t('contact.info.email'),
      items: [
        { label: 'General', value: 'info@allscholarshipshub.com' },
        { label: 'Support', value: 'support@allscholarshipshub.com' }
      ] as { label: string; value: string }[]
    },
    {
      icon: Clock,
      title: t('contact.info.hours'),
      items: [
        { label: '', value: t('contact.info.hoursValue') }
      ] as { label: string; value: string }[]
    }
  ];

  return (
    <section className="py-16 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {t('contact.form.success')}
                    </h3>
                    <Button 
                      onClick={() => setIsSubmitted(false)} 
                      variant="outline"
                      className="mt-4"
                    >
                      {t('contact.form.send')}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          {t('contact.form.name')} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder={t('contact.form.name')}
                          className="h-12"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          {t('contact.form.email')} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t('contact.form.email')}
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          {t('contact.form.phone')}
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 234 567 890"
                          className="h-12"
                        />
                      </div>

                      {/* Subject */}
                      <div className="space-y-2">
                        <Label htmlFor="subject">
                          {t('contact.form.subject')} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder={t('contact.form.subject')}
                          className="h-12"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">
                        {t('contact.form.message')} <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t('contact.form.message')}
                        rows={6}
                        className="resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {t('contact.form.sending')}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          {t('contact.form.send')}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">{info.title}</h3>
                      <div className="space-y-1">
                        {info.items.map((item, idx) => (
                          <div key={idx} className="text-slate-600">
                            {item.label && (
                              <span className="text-sm text-slate-500">{item.label}: </span>
                            )}
                            <span className={item.label === 'Ghana' || item.label === 'China' ? 'font-medium text-blue-600' : ''}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Quick Contact Card */}
            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">{t('contact.info.title')}</h3>
                <p className="text-blue-100 mb-6">
                  Need immediate assistance? Call us directly using the numbers above.
                </p>
                <div className="space-y-3">
                  <a 
                    href="tel:+233549307901" 
                    className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>+233 549 307 901</span>
                  </a>
                  <a 
                    href="tel:+8613255696140" 
                    className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>+86 132 5569 6140</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
