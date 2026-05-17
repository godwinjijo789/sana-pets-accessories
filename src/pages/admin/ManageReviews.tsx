import React, { useState, useEffect } from 'react';
import { 
  deleteReview 
} from '../../services/firebaseService';
import { db } from '../../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Review } from '../../types';
import { 
  Search, 
  Trash2, 
  Star, 
  Clock, 
  User,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

const ManageReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this review?')) {
      try {
        await deleteReview(id);
        toast.success('Review removed');
        fetchReviews();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const filteredReviews = reviews.filter(rev => 
    rev.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rev.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold italic">User Reviews</h1>
        <p className="text-slate-500">Monitor and manage feedback left by store visitors.</p>
      </div>

      <div className="glass p-4 rounded-3xl flex items-center gap-4">
        <Search className="text-slate-400 ml-2" size={20} />
        <input 
          type="text" 
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none w-full font-medium"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          [1, 2, 3, 4].map(i => <div key={i} className="h-40 glass animate-pulse rounded-3xl" />)
        ) : (
          <>
            {filteredReviews.map((rev) => (
              <motion.div 
                key={rev.id}
                layout
                className="glass p-6 rounded-[2rem] flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{rev.userName}</h4>
                        <div className="flex text-amber-500 space-x-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={10} fill={s <= rev.rating ? 'currentColor' : 'none'} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(rev.id!)}
                      className="p-2 text-red-500 opacity-0 group-hover:opacity-100 glass rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic mb-4 line-clamp-3">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Clock size={12} />
                  <span>{formatDate(rev.createdAt)}</span>
                </div>
              </motion.div>
            ))}
            {filteredReviews.length === 0 && (
              <div className="col-span-full py-20 text-center glass rounded-3xl">
                <Star size={64} className="mx-auto text-slate-200 mb-2" />
                <p className="text-slate-400 font-bold">No reviews yet</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManageReviews;
