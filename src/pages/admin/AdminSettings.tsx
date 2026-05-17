import React, { useState, useEffect } from 'react';
import { getContactInfo, updateContactInfo, getAdmins } from '../../services/firebaseService';
import { ContactInfo, Admin } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  Save, 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter, 
  MessageCircle,
  Loader2,
  Info,
  Shield,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettings: React.FC = () => {
  const { adminData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: '',
    email: '',
    address: '',
    socials: {
      facebook: '',
      instagram: '',
      whatsapp: '',
      twitter: ''
    }
  });

  useEffect(() => {
    const fetchInfo = async () => {
      const [contactData, adminList] = await Promise.all([
        getContactInfo(),
        getAdmins()
      ]);
      if (contactData) setContactInfo(contactData);
      if (adminList) setAdmins(adminList);
      setLoading(false);
    };
    fetchInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateContactInfo(contactInfo);
      toast.success('Contact information updated successfully!');
    } catch (error) {
      toast.error('Failed to update information');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold italic">Contact Settings</h1>
        <p className="text-slate-500">Update the information shown on the contact page and footer.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-20">
        {/* Core Info */}
        <section className="glass p-10 rounded-[2.5rem] space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Info size={20} className="text-primary" />
            General Information
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Store Phone</label>
              <div className="relative">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={18} />
                <input 
                  type="text" 
                  className="w-full glass bg-white/20 dark:bg-slate-900/20 pl-14 pr-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Store Email</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={18} />
                <input 
                  type="email" 
                  className="w-full glass bg-white/20 dark:bg-slate-900/20 pl-14 pr-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Store Address</label>
              <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={18} />
                <textarea 
                  rows={3}
                  className="w-full glass bg-white/20 dark:bg-slate-900/20 pl-14 pr-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border resize-none"
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Social Links */}
        <div className="space-y-10">
          <section className="glass p-10 rounded-[2.5rem] space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Instagram size={20} className="text-primary" />
              Social Media Links
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Instagram URL</label>
                <div className="relative">
                  <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
                  <input 
                    type="text" 
                    className="w-full glass bg-white/20 dark:bg-slate-900/20 pl-14 pr-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border"
                    value={contactInfo.socials.instagram}
                    onChange={(e) => setContactInfo({...contactInfo, socials: {...contactInfo.socials, instagram: e.target.value}})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Facebook URL</label>
                <div className="relative">
                  <Facebook className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                  <input 
                    type="text" 
                    className="w-full glass bg-white/20 dark:bg-slate-900/20 pl-14 pr-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border"
                    value={contactInfo.socials.facebook}
                    onChange={(e) => setContactInfo({...contactInfo, socials: {...contactInfo.socials, facebook: e.target.value}})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">WhatsApp Number</label>
                <div className="relative">
                  <MessageCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                  <input 
                    type="text" 
                    className="w-full glass bg-white/20 dark:bg-slate-900/20 pl-14 pr-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border"
                    value={contactInfo.socials.whatsapp}
                    placeholder="e.g. 1234567890"
                    onChange={(e) => setContactInfo({...contactInfo, socials: {...contactInfo.socials, whatsapp: e.target.value}})}
                  />
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-primary w-full py-5 flex items-center justify-center gap-3 shadow-2xl"
                >
                  {submitting ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                  {submitting ? 'Saving Changes...' : 'Save All Settings'}
                </button>
              </div>
            </div>
          </section>

          {/* Admin List */}
          <section className="glass p-10 rounded-[2.5rem] space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Shield size={20} className="text-primary" />
              Administrators
            </h3>
            
            <div className="space-y-4">
              {admins.length > 0 ? (
                admins.map((admin) => (
                  <div key={admin.uid} className="flex items-center gap-4 glass bg-white/5 dark:bg-slate-900/5 p-4 rounded-2xl">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User size={20} />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-sm">{admin.name}</h4>
                      <p className="text-xs text-slate-500">{admin.email}</p>
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${admin.role === 'owner' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                      {admin.role}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-slate-500 text-sm italic">
                  No administrators registered yet.
                </div>
              )}
              
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex gap-3">
                <Info size={16} className="text-primary shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                  New administrators must log in with their Google account to be automatically registered if they are on the authorized list.
                </p>
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
