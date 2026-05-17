import React from 'react';
import { motion } from 'motion/react';
import { PawPrint, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Pet } from '../../types';

interface PetCardProps {
  pet: Pet;
}

export const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card group h-full flex flex-col"
    >
      <div className="relative h-64 overflow-hidden rounded-t-2xl">
        <img 
          src={pet.images[0] || 'https://via.placeholder.com/400x400?text=Pet'} 
          alt={pet.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
          {pet.availability ? (
            <span className="text-emerald-600 flex items-center gap-1">Available</span>
          ) : (
            <span className="text-red-600">Reserved</span>
          )}
        </div>
        <div className="absolute bottom-4 left-4 flex gap-1">
          <span className="bg-primary/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
            {pet.breed}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold font-serif">{pet.name}</h3>
          <span className="text-primary font-bold text-lg">Rs. {pet.price}</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <div className="flex items-center gap-1">
            <PawPrint size={14} />
            <span>{pet.age}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{pet.gender}</span>
          </div>
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6">
          {pet.description}
        </p>
        
        <div className="mt-auto">
          <Link 
            to={`/pets/${pet.id}`} 
            className="w-full py-3 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white transition-all rounded-xl font-semibold group/btn"
          >
            View Details
            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
