import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Mail, Phone, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { getContactInfo } from '../../services/firebaseService';
import { ContactInfo } from '../../types';

export const Footer: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    getContactInfo().then(data => {
      if (data) setContactInfo(data);
    });
  }, []);

  return (
    <footer className="pt-20 pb-10 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-xl">
                <PawPrint className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold font-serif italic">
                Sana <span className="text-primary">Pets</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Premium pet store providing the best companions and high-quality accessories for your furry friends.
            </p>
            <div className="flex gap-4">
              {contactInfo?.socials.instagram && (
                <a href={contactInfo.socials.instagram} target="_blank" rel="noreferrer" className="p-2 glass rounded-full hover:text-primary transition-colors"><Instagram size={20} /></a>
              )}
              {contactInfo?.socials.facebook && (
                <a href={contactInfo.socials.facebook} target="_blank" rel="noreferrer" className="p-2 glass rounded-full hover:text-primary transition-colors"><Facebook size={20} /></a>
              )}
              {contactInfo?.socials.whatsapp && (
                <a href={`https://wa.me/${contactInfo.socials.whatsapp}`} target="_blank" rel="noreferrer" className="p-2 glass rounded-full hover:text-primary transition-colors"><MessageCircle size={20} /></a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Pets', 'Accessories', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <Phone size={18} className="text-primary" />
                <span>{contactInfo?.phone || '+1 234 567 890'}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <Mail size={18} className="text-primary" />
                <span>{contactInfo?.email || 'info@sanapets.com'}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <MapPin size={18} className="text-primary" />
                <span>{contactInfo?.address || '123 Pet Street, Animal City'}</span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">FAQs</Link></li>
              <li><Link to="/contact" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Shipping Info</Link></li>
              <li><Link to="/admin/login" className="text-slate-400 dark:text-slate-500 hover:text-primary transition-colors text-sm">Admin Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Sana Pets & Accessories. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
