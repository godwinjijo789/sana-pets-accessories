import React, { useEffect, useState } from 'react';
import { getAccessories } from '../../services/firebaseService';
import { Accessory } from '../../types';
import { AccessoryCard } from '../../components/public/AccessoryCard';
import { Search, Filter, ShoppingBag } from 'lucide-react';

const Accessories: React.FC = () => {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchAccessories = async () => {
      const data = await getAccessories();
      setAccessories(data || []);
      setLoading(false);
    };
    fetchAccessories();
  }, []);

  const categories = ['All', 'Food', 'Toys', 'Collars', 'Beds', 'Grooming'];

  const filteredAccessories = accessories.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-6 py-12 min-h-screen">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h1 className="text-5xl font-serif font-bold italic">Pet Accessories</h1>
        <p className="text-slate-500 dark:text-slate-400">Premium supplies to keep your pets happy, healthy, and stylish.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="relative flex-grow">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-3xl glass outline-none focus:border-primary border-transparent transition-all"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-4 rounded-3xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'glass text-slate-500 hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-[350px] bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          {filteredAccessories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredAccessories.map(acc => (
                <AccessoryCard key={acc.id} accessory={acc} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 glass rounded-[3rem]">
              <ShoppingBag size={64} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-2xl font-bold text-slate-400">No accessories found</h3>
              <p className="text-slate-500">Try searching for something else or change category.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Accessories;
