import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Accessory } from '../../types';

interface AccessoryCardProps {
  accessory: Accessory;
}

export const AccessoryCard: React.FC<AccessoryCardProps> = ({ accessory }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card group h-full flex flex-col"
    >
      <div className="relative h-60 overflow-hidden rounded-t-2xl p-4 flex items-center justify-center bg-slate-50 dark:bg-slate-800/30">
        <img 
          src={accessory.images[0] || 'https://via.placeholder.com/400x400?text=Accessory'} 
          alt={accessory.name}
          className="max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-primary text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
          {accessory.category}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold font-serif line-clamp-1">{accessory.name}</h3>
          <span className="text-primary font-bold">Rs. {accessory.price}</span>
        </div>
        
        <div className="flex items-center gap-1 text-amber-500 mb-4">
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <span className="text-xs text-slate-400 ml-1">(4.5)</span>
        </div>
        
        <div className="mt-auto">
          <Link 
            to={`/accessories/${accessory.id}`} 
            className="w-full py-3 flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-all rounded-xl font-semibold group/btn"
          >
            Details
            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
