import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPetById, addEnquiry, getContactInfo } from '../../services/firebaseService';
import { Pet, ContactInfo } from '../../types';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  MessageCircle, 
  ShieldCheck, 
  Info, 
  Calendar, 
  Dna, 
  User, 
  BadgeCheck, 
  Send
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import toast from 'react-hot-toast';

const PetDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    if (id) {
      Promise.all([
        getPetById(id),
        getContactInfo()
      ]).then(([petData, contactData]) => {
        setPet(petData);
        if (contactData) setContactInfo(contactData);
        setLoading(false);
      });
    }
  }, [id]);

  const handleEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setEnquiryLoading(true);
    try {
      await addEnquiry({
        ...formData,
        message: `[Inquiry for ${pet?.name}] ${formData.message}`
      });
      toast.success('Your enquiry has been sent successfully!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send enquiry. Please try again.');
    } finally {
      setEnquiryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-32 container mx-auto px-6 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 font-medium">Loading pet details...</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen py-32 container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Pet Not Found</h2>
        <Link to="/pets" className="text-primary font-bold underline">Back to Pets</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <Link to="/pets" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 font-medium">
        <ChevronLeft size={20} />
        Back to Listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Images */}
        <section className="space-y-8">
          <div className="rounded-[3rem] overflow-hidden shadow-2xl glass p-2">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="rounded-[2.5rem] w-full aspect-[4/5] md:aspect-square"
            >
              {pet.images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img src={img} alt={`${pet.name} - ${idx}`} className="w-full h-full object-cover" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="glass p-6 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <ShieldCheck size={28} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Vaccination</p>
                <p className="font-bold">{pet.vaccination}</p>
              </div>
            </div>
            <div className="glass p-6 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                <BadgeCheck size={28} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Health Status</p>
                <p className="font-bold">Certified Healthy</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Info */}
        <section className="space-y-10">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-6xl font-serif font-bold italic">{pet.name}</h1>
              <span className="text-3xl font-bold text-primary">Rs. {pet.price}</span>
            </div>
            <p className="text-xl text-slate-500 flex items-center gap-2">
              {pet.breed} • {pet.age} • {pet.gender}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Calendar, label: 'Age', value: pet.age },
              { icon: User, label: 'Gender', value: pet.gender },
              { icon: Dna, label: 'Breed', value: pet.breed },
            ].map((spec, i) => (
              <div key={i} className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl text-center flex flex-col items-center gap-2">
                <spec.icon size={20} className="text-primary" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">{spec.label}</p>
                  <p className="font-bold text-sm">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold font-serif italic flex items-center gap-2">
              <Info size={24} className="text-primary" />
              About {pet.name}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              {pet.description}
            </p>
          </div>

          <div className="flex gap-4 pt-6">
            <a 
              href={`https://wa.me/${contactInfo?.socials.whatsapp || '1234567890'}?text=Hi, I'm interested in adopting ${pet.name} (${pet.breed})`} 
              target="_blank" 
              rel="noreferrer"
              className="flex-grow py-4 px-6 bg-[#25D366] text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-green-500/20 transition-all active:scale-95"
            >
              <MessageCircle size={24} />
              Enquire on WhatsApp
            </a>
          </div>

          <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold mb-6">Send an Enquiry</h3>
            <form onSubmit={handleEnquiry} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="glass w-full px-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="glass w-full px-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <input 
                type="text" 
                placeholder="Phone Number (Optional)" 
                className="glass w-full px-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <textarea 
                placeholder="How can we help you?" 
                rows={4}
                className="glass w-full px-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border resize-none"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
              <button 
                type="submit" 
                disabled={enquiryLoading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {enquiryLoading ? 'Sending...' : 'Send Message'}
                <Send size={18} />
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PetDetails;
