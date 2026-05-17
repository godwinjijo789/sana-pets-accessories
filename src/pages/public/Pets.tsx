import React, { useEffect, useState } from 'react';
import { getPets } from '../../services/firebaseService';
import { Pet } from '../../types';
import { PetCard } from '../../components/public/PetCard';
import { Search, Filter, SlidersHorizontal, PawPrint } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Pets: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');

  useEffect(() => {
    const fetchPets = async () => {
      const data = await getPets();
      setPets(data || []);
      setLoading(false);
    };
    fetchPets();
  }, []);

  const breeds = ['All', ...Array.from(new Set(pets.map(p => p.breed)))];

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBreed = selectedBreed === 'All' || pet.breed === selectedBreed;
    const matchesGender = selectedGender === 'All' || pet.gender === selectedGender;
    return matchesSearch && matchesBreed && matchesGender;
  });

  return (
    <div className="container mx-auto px-6 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div className="space-y-2">
          <h1 className="text-5xl font-serif font-bold italic">Available Pets</h1>
          <p className="text-slate-500 dark:text-slate-400">Find your next perfect companion from our curated selection.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search pets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition-all w-full md:w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 glass rounded-full font-medium hover:text-primary transition-colors">
            <SlidersHorizontal size={18} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="glass p-8 rounded-[2rem] space-y-8">
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Filter size={18} className="text-primary" />
                Filter by Breed
              </h3>
              <div className="space-y-2">
                {breeds.map(breed => (
                  <button
                    key={breed}
                    onClick={() => setSelectedBreed(breed)}
                    className={`w-full text-left px-4 py-2 rounded-xl transition-all ${
                      selectedBreed === breed ? 'bg-primary text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {breed}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Gender</h3>
              <div className="flex gap-2">
                {['All', 'Male', 'Female'].map(gender => (
                  <button
                    key={gender}
                    onClick={() => setSelectedGender(gender as any)}
                    className={`flex-grow px-4 py-2 rounded-xl transition-all border ${
                      selectedGender === gender 
                        ? 'border-primary bg-primary/10 text-primary font-bold' 
                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Pet Listing */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[400px] bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <>
              {filteredPets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredPets.map(pet => (
                    <PetCard key={pet.id} pet={pet} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 glass rounded-[2rem]">
                  <PawPrint size={64} className="mx-auto text-slate-200 mb-4" />
                  <h3 className="text-2xl font-bold text-slate-400">No pets found</h3>
                  <p className="text-slate-500">Try adjusting your search or filters.</p>
                  <button 
                    onClick={() => {setSearchTerm(''); setSelectedBreed('All'); setSelectedGender('All');}}
                    className="mt-6 text-primary font-bold underline"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pets;
