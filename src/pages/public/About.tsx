import React from 'react';
import { motion } from 'motion/react';
import { Heart, Shield, Star, ThumbsUp, Users, Award, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="space-y-32 mb-32">
      {/* Intro section */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
               <Heart size={16} fill="currentColor" />
               <span>Our Story</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold italic leading-tight">
              A Passion For <br />
              <span className="text-primary">Happy Tails</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Founded in 2015, Sana Pets & Accessories began with a simple mission: to connect loving families with healthy, happy pets while providing premium care essentials.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                <p className="text-4xl font-bold text-primary font-serif italic">100%</p>
                <p className="text-slate-500 font-medium">Ethical Breeding</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary font-serif italic">15k+</p>
                <p className="text-slate-500 font-medium">Happy Pet Parents</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800" 
                alt="Puppy" 
                className="w-full h-auto scale-110 hover:scale-100 transition-transform duration-[2s]"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* Values section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-serif font-bold italic">What We Stand For</h2>
            <p className="text-slate-500">Our values guide everything we do, from selecting our pets to sourcing our products.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Animal Welfare', desc: 'The health and happiness of our animals is our top priority. We partner only with ethical breeders.', icon: Heart, color: 'bg-red-100 text-red-600' },
              { title: 'Premium Quality', desc: 'Every product in our store is hand-picked and tested for safety and durability.', icon: Award, color: 'bg-amber-100 text-amber-600' },
              { title: 'Customer Love', desc: 'We treat every customer like family and every pet like our own. Your joy is our success.', icon: Users, color: 'bg-blue-100 text-blue-600' },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="glass p-10 rounded-[2.5rem] space-y-6"
              >
                <div className={`w-16 h-16 rounded-2xl ${value.color} flex items-center justify-center`}>
                  <value.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold font-serif italic">{value.title}</h3>
                <p className="text-slate-500 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience section */}
      <section className="container mx-auto px-6">
        <div className="glass rounded-[4rem] p-12 md:p-24 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <div>
              <h2 className="text-5xl font-serif font-bold mb-8 italic">The Sana Experience</h2>
              <div className="space-y-6">
                {[
                  'Professional pet consultants for every breed.',
                  'Free first vaccination and health checkup.',
                  'Exclusive member-only discounts on accessories.',
                  'Lifetime support for your pets health queries.'
                ].map((text, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                      <Star size={12} fill="currentColor" />
                    </div>
                    <p className="font-medium text-lg text-slate-600 dark:text-slate-400">{text}</p>
                  </div>
                ))}
              </div>
              <div className="pt-10">
                <Link to="/contact" className="btn-primary">Learn More</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <img src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=400" className="rounded-3xl shadow-xl mt-12" alt="pet" />
               <img src="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400" className="rounded-3xl shadow-xl" alt="pet" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
