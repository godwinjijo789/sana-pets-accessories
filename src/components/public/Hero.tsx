import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, PawPrint, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 right-[10%] w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-[5%] w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
            <Sparkles size={16} />
            <span>Welcome to Sana Pets & Accessories</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
            Find Your Perfect <br />
            <span className="text-primary italic">Pet Companion</span> 
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
            Discover a world of premium pets and high-quality accessories tailored for your furry, feathery, or scaly friends.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/pets" className="btn-primary flex items-center gap-2 group">
              Explore Pets
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/accessories" className="btn-outline">
              Shop Accessories
            </Link>
          </div>
          
          <div className="flex items-center gap-8 pt-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => <Heart key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-sm font-medium">1,000+ Happy pet owners</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <img 
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800" 
              alt="Golden Retriever" 
              className="w-full h-auto"
            />
          </div>
          
          {/* Floating Cards */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-10 -right-10 glass p-6 rounded-3xl shadow-xl z-20 flex items-center gap-4"
          >
            <div className="bg-amber-100 p-3 rounded-2xl">
              <PawPrint className="text-amber-600" size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Adopted Today</p>
              <p className="font-bold text-lg">12 New Friends</p>
            </div>
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-5 -left-10 glass p-5 rounded-3xl shadow-xl z-20 flex items-center gap-4"
          >
            <div className="bg-blue-100 p-3 rounded-2xl">
              <Sparkles className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Premium Quality</p>
              <p className="font-bold text-lg">Trusted Products</p>
            </div>
          </motion.div>
          
          {/* Decorative shapes */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-full blur-[100px] -z-10 scale-110"></div>
        </motion.div>
      </div>
    </section>
  );
};
