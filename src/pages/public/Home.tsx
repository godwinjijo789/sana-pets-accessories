import React, { useEffect, useState } from 'react';
import { Hero } from '../../components/public/Hero';
import { PetCard } from '../../components/public/PetCard';
import { AccessoryCard } from '../../components/public/AccessoryCard';
import { getPets, getAccessories } from '../../services/firebaseService';
import { seedInitialData } from '../../services/seedService';
import { Pet, Accessory } from '../../types';
import { motion } from 'motion/react';
import { ArrowRight, Star, Heart, Shield, Truck, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Home: React.FC = () => {
  const [featuredPets, setFeaturedPets] = useState<Pet[]>([]);
  const [featuredAccessories, setFeaturedAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [pets, accessories] = await Promise.all([getPets(), getAccessories()]);
    setFeaturedPets((pets || []).slice(0, 4));
    setFeaturedAccessories((accessories || []).slice(0, 4));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSeed = async () => {
    const loadingToast = toast.loading('Seeding data...');
    await seedInitialData();
    toast.dismiss(loadingToast);
    toast.success('Sample data loaded!');
    fetchData();
  };

  const stats = [
    { label: 'Pets Adopted', value: '5,000+', icon: Heart, color: 'text-red-500' },
    { label: 'Quality Products', value: '2,500+', icon: Shield, color: 'text-emerald-500' },
    { label: 'Fast Delivery', value: '24/7', icon: Truck, color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-32">
      <Hero />

      {/* Stats Section */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-8 rounded-3xl flex items-center gap-6"
            >
              <div className={`p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 ${stat.color} shadow-sm`}>
                <stat.icon size={32} />
              </div>
              <div>
                <p className="text-3xl font-bold font-serif">{stat.value}</p>
                <p className="text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Pets */}
      <section className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Our New Friends</span>
            <h2 className="text-4xl font-serif font-bold mt-2 italic">Featured Pets</h2>
          </div>
          <Link to="/pets" className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight size={20} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-[400px] bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />)}
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredPets.map(pet => <PetCard key={pet.id} pet={pet} />)}
            </div>
            {featuredPets.length === 0 && (
              <div className="py-20 text-center glass rounded-3xl space-y-6">
                <Database size={48} className="mx-auto text-slate-300" />
                <div>
                  <h3 className="text-xl font-bold">The store is currently empty</h3>
                  <p className="text-slate-500">Would you like to populate the store with premium sample data?</p>
                </div>
                <button 
                  onClick={handleSeed}
                  className="btn-primary flex items-center gap-2 mx-auto"
                >
                  <Database size={18} />
                  Seed Sample Data
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-900 text-white py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-primary font-bold uppercase tracking-widest text-xs">Professional Care</span>
              <h2 className="text-5xl font-serif font-bold mt-4 mb-8">Why Shop With Us?</h2>
              <div className="space-y-8">
                {[
                  { title: 'Healthy & Vaccinated Pets', desc: 'All our pets are thoroughly checked by certified veterinarians before being listed.', icon: Heart },
                  { title: 'Premium Accessory Brands', desc: 'We only stock high-quality accessories that are safe and comfortable for your pets.', icon: Shield },
                  { title: 'Expert Pet Guidance', desc: 'Our team provides 24/7 post-adoption support and guidance for new pet parents.', icon: Star },
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-6"
                  >
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center text-primary">
                      <item.icon size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=800" 
                alt="Vet care" 
                className="rounded-3xl shadow-2xl skew-y-3"
              />
              <div className="absolute -bottom-10 -left-10 glass text-slate-900 p-8 rounded-3xl animate-bounce-slow">
                <p className="text-4xl font-serif font-bold text-primary italic">100%</p>
                <p className="font-bold">Happy Guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Accessories */}
      <section className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Pet Essentials</span>
            <h2 className="text-4xl font-serif font-bold mt-2 italic">Best Sellers</h2>
          </div>
          <Link to="/accessories" className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all">
            Shop All <ArrowRight size={20} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-[350px] bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredAccessories.map(acc => <AccessoryCard key={acc.id} accessory={acc} />)}
            {featuredAccessories.length === 0 && (
              <div className="col-span-full py-20 text-center text-slate-500">No accessories listed yet.</div>
            )}
          </div>
        )}
      </section>

      {/* NewsLetter */}
      <section className="container mx-auto px-6 mb-32">
        <div className="relative rounded-[3rem] bg-primary overflow-hidden p-12 md:p-24 text-center text-white">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif font-bold italic">Join Our Pet Family</h2>
            <p className="text-white/80 text-lg">Subscribe to get pet care tips, exclusive discounts, and new pet arrivals straight to your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-grow px-6 py-4 rounded-full bg-white text-slate-900 border-none outline-none focus:ring-2 focus:ring-slate-300" 
              />
              <button type="submit" className="px-8 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
