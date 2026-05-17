import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAccessoryById, getReviewsByAccessoryId, addReview, getContactInfo } from '../../services/firebaseService';
import { Accessory, Review, ContactInfo } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Star, 
  ShoppingBag, 
  Info, 
  MessageSquare,
  Clock,
  User,
  Trash2
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import toast from 'react-hot-toast';
import { formatDate } from '../../lib/utils';

const AccessoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [accessory, setAccessory] = useState<Accessory | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    if (id) {
      Promise.all([
        getAccessoryById(id),
        getContactInfo()
      ]).then(([accData, contactData]) => {
        setAccessory(accData);
        if (contactData) setContactInfo(contactData);
        setLoading(false);
      });

      const unsubscribe = getReviewsByAccessoryId(id, (data) => {
        setReviews(data);
      });

      return () => unsubscribe();
    }
  }, [id]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.userName || !reviewForm.comment) {
      toast.error('Please fill in your name and comment.');
      return;
    }

    try {
      await addReview({
        accessoryId: id!,
        ...reviewForm
      });
      toast.success('Thank you for your review!');
      setReviewForm({ userName: '', rating: 5, comment: '' });
    } catch (error) {
      toast.error('Failed to submit review.');
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, current) => acc + current.rating, 0) / reviews.length).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!accessory) {
    return (
      <div className="min-h-screen container mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold">Product not found.</h2>
        <Link to="/accessories" className="text-primary mt-4 inline-block">Back to Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <Link to="/accessories" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8">
        <ChevronLeft size={20} />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Left: Images */}
        <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 flex items-center justify-center">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="w-full"
          >
            {accessory.images.map((img, idx) => (
              <SwiperSlide key={idx} className="flex items-center justify-center">
                <img src={img} alt={accessory.name} className="max-h-[500px] w-auto object-contain" />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Right: details */}
        <section className="space-y-10">
          <div className="space-y-4">
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest">
              {accessory.category}
            </div>
            <h1 className="text-5xl font-serif font-bold italic">{accessory.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">Rs. {accessory.price}</span>
              {reviews.length > 0 && (
                <div className="flex items-center gap-1 text-amber-500 border-l border-slate-200 dark:border-slate-800 pl-4 ml-4">
                  <Star size={18} fill="currentColor" />
                  <span className="font-bold">{averageRating}</span>
                  <span className="text-slate-400 text-sm">({reviews.length} reviews)</span>
                </div>
              )}
            </div>
          </div>

          <div className="glass p-8 rounded-3xl space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Info size={20} className="text-primary" />
              Product Description
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {accessory.description}
            </p>
          </div>

          <div className="pt-4">
            <a 
              href={`https://wa.me/${contactInfo?.socials.whatsapp || '1234567890'}?text=Hi, I want to buy ${accessory.name}`} 
              target="_blank" 
              rel="noreferrer"
              className="w-full sm:w-auto btn-primary flex items-center justify-center gap-3 px-12"
            >
              <ShoppingBag size={20} />
              Buy via WhatsApp
            </a>
          </div>
        </section>
      </div>

      {/* Reviews Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-1 space-y-8">
          <div className="glass p-8 rounded-3xl overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
             <h2 className="text-3xl font-serif font-bold italic mb-6">Customer Reviews</h2>
             
             <div className="flex items-center gap-4 mb-8">
               <div className="text-5xl font-bold text-primary">{averageRating}</div>
               <div>
                 <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={16} fill={s <= Number(averageRating) ? 'currentColor' : 'none'} />
                    ))}
                 </div>
                 <p className="text-sm text-slate-500">Based on {reviews.length} reviews</p>
               </div>
             </div>

             <form onSubmit={handleAddReview} className="space-y-4">
               <div>
                 <label className="block text-sm font-bold mb-2">Rating</label>
                 <div className="flex gap-2">
                   {[1, 2, 3, 4, 5].map((r) => (
                     <button
                      key={r}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: r })}
                      className={`p-2 rounded-lg transition-all ${reviewForm.rating >= r ? 'text-amber-500' : 'text-slate-300'}`}
                     >
                       <Star size={24} fill={reviewForm.rating >= r ? 'currentColor' : 'none'} />
                     </button>
                   ))}
                 </div>
               </div>
               <input 
                 type="text" 
                 placeholder="Your Name" 
                 className="w-full glass bg-white/30 dark:bg-slate-800/30 px-5 py-4 rounded-2xl outline-none focus:border-primary border-transparent border" 
                 value={reviewForm.userName}
                 onChange={(e) => setReviewForm({...reviewForm, userName: e.target.value})}
               />
               <textarea 
                 placeholder="Share your experience..." 
                 rows={4}
                 className="w-full glass bg-white/30 dark:bg-slate-800/30 px-5 py-4 rounded-2xl outline-none focus:border-primary border-transparent border resize-none"
                 value={reviewForm.comment}
                 onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
               ></textarea>
               <button type="submit" className="w-full btn-primary">Submit Review</button>
             </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={review.id} 
                  className="glass p-6 rounded-3xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold">{review.userName}</h4>
                        <div className="flex text-amber-500">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} fill={s <= review.rating ? 'currentColor' : 'none'} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Clock size={12} />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {review.comment}
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-300 dark:border-slate-700">
                <MessageSquare size={48} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-400">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccessoryDetails;
