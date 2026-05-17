import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Instagram, Facebook, Twitter, Loader2 } from 'lucide-react';
import { addEnquiry, getContactInfo } from '../../services/firebaseService';
import { ContactInfo } from '../../types';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    getContactInfo().then(data => {
      if (data) setContactInfo(data);
      setPageLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      await addEnquiry(formData);
      toast.success('Your message has been sent. We will get back to you soon!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
        <h1 className="text-5xl font-serif font-bold italic">Get In Touch</h1>
        <p className="text-slate-500 dark:text-slate-400">Have questions about our pets or accessories? We're here to help you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Contact info */}
        <section className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-bold font-serif">Call Us</h3>
              <p className="text-slate-500 font-medium">{contactInfo?.phone || '+1 (234) 567 890'}</p>
            </div>
            
            <div className="glass p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-bold font-serif">Email Us</h3>
              <p className="text-slate-500 font-medium">{contactInfo?.email || 'info@sanapets.com'}</p>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl space-y-6">
            <h3 className="text-2xl font-bold font-serif italic flex items-center gap-2">
              <MapPin size={24} className="text-primary" />
              Visit Our Store
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {contactInfo?.address || (
                <>
                  123 Pet Paradise Street, Animal Kingdom Avenue,<br />
                  New York, NY 10001, United States
                </>
              )}
            </p>
            
            {/* Map Placeholder */}
            <div className="w-full h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden grayscale">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1689876543210!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
            </div>
          </div>

          <div className="flex gap-6">
            {contactInfo?.socials.instagram && (
              <a href={contactInfo.socials.instagram} target="_blank" rel="noreferrer" className="flex-1 glass p-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:text-primary transition-colors">
                <Instagram size={20} /> Instagram
              </a>
            )}
            {contactInfo?.socials.facebook && (
              <a href={contactInfo.socials.facebook} target="_blank" rel="noreferrer" className="flex-1 glass p-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:text-primary transition-colors">
                <Facebook size={20} /> Facebook
              </a>
            )}
            {contactInfo?.socials.whatsapp && (
              <a href={`https://wa.me/${contactInfo.socials.whatsapp}`} target="_blank" rel="noreferrer" className="flex-1 glass p-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:text-primary transition-colors">
                <MessageCircle size={20} /> WhatsApp
              </a>
            )}
          </div>
        </section>

        {/* Contact Form */}
        <section className="glass p-10 md:p-12 rounded-[3.5rem] relative overflow-hidden backdrop-blur-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl font-serif font-bold italic">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-2">Your Name *</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full bg-white/50 dark:bg-slate-900/50 px-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold ml-2">Email Address *</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full bg-white/50 dark:bg-slate-900/50 px-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold ml-2">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+1 (234) 567 890"
                  className="w-full bg-white/50 dark:bg-slate-900/50 px-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold ml-2">Message *</label>
                <textarea 
                  placeholder="How can we help you?"
                  rows={5}
                  className="w-full bg-white/50 dark:bg-slate-900/50 px-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border transition-all resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-3"
              >
                {loading ? 'Sending...' : 'Send Message'}
                <Send size={20} />
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
