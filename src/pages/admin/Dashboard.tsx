import React, { useEffect, useState } from 'react';
import { 
  getPets, 
  getAccessories, 
  getEnquiries, 
} from '../../services/firebaseService';
import { db, auth } from '../../firebase/config';
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { 
  Dog, 
  ShoppingBag, 
  MessageSquare, 
  Star, 
  TrendingUp,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../lib/utils';
import { isSupabaseConfigured } from '../../lib/supabase';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    pets: 0,
    accessories: 0,
    enquiries: 0,
    reviews: 0
  });
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    supabase: isSupabaseConfigured(),
    firebaseAdmin: false
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Double check admin status
        if (auth.currentUser) {
          const adminDoc = await getDoc(doc(db, 'admins', auth.currentUser.uid));
          setSystemStatus(prev => ({ ...prev, firebaseAdmin: adminDoc.exists() }));
        }
        const [pets, accessories, enquiries] = await Promise.all([
          getPets(),
          getAccessories(),
          getEnquiries()
        ]);

        // For reviews, we'll fetch them manually here since we don't have a get all reviews service
        const reviewsSnap = await getDocs(collection(db, 'reviews'));
        
        setStats({
          pets: pets?.length || 0,
          accessories: accessories?.length || 0,
          enquiries: enquiries?.length || 0,
          reviews: reviewsSnap.docs.length
        });

        setRecentEnquiries((enquiries || []).slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Pets', value: stats.pets, icon: Dog, color: 'bg-orange-100 text-orange-600', path: '/admin/pets' },
    { title: 'Total Accessories', value: stats.accessories, icon: ShoppingBag, color: 'bg-blue-100 text-blue-600', path: '/admin/accessories' },
    { title: 'New Enquiries', value: stats.enquiries, icon: MessageSquare, color: 'bg-indigo-100 text-indigo-600', path: '/admin/enquiries' },
    { title: 'Total Reviews', value: stats.reviews, icon: Star, color: 'bg-amber-100 text-amber-600', path: '/admin/reviews' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 glass animate-pulse rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-serif font-bold italic">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back! Here's what's happening in your pet shop today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <Link to={stat.path} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
                <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="mt-4">
              <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-3xl font-bold font-serif">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Enquiries */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold font-serif italic flex items-center gap-2">
              <MessageSquare size={20} className="text-primary" />
              Recent Enquiries
            </h3>
            <Link to="/admin/enquiries" className="text-sm font-bold text-primary hover:underline">View All</Link>
          </div>

          <div className="glass rounded-3xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Sender</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Message</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Date</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentEnquiries.length > 0 ? (
                  recentEnquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm">{enq.name}</p>
                        <p className="text-xs text-slate-400">{enq.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm line-clamp-1">{enq.message}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock size={12} />
                          {formatDate(enq.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          enq.status === 'unread' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          {enq.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">No recent enquiries.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Placeholder for Analytics */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xl font-bold font-serif italic flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Quick Actions
          </h3>
          <div className="space-y-4">
             {[
               { title: 'Add New Pet', icon: Dog, path: '/admin/pets', color: 'bg-primary' },
               { title: 'Add Accessory', icon: ShoppingBag, path: '/admin/accessories', color: 'bg-secondary' },
               { title: 'Review Comments', icon: Star, path: '/admin/reviews', color: 'bg-amber-500' },
             ].map((action, i) => (
                <Link 
                  key={i} 
                  to={action.path}
                  className="flex items-center gap-4 p-4 glass rounded-2xl hover:translate-x-2 transition-transform group"
                >
                  <div className={`p-3 rounded-xl ${action.color} text-white shadow-lg`}>
                    <action.icon size={20} />
                  </div>
                  <span className="font-bold flex-grow">{action.title}</span>
                  <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
             ))}
          </div>

          <div className="glass p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <ShieldCheck size={20} className="text-primary" />
              System Status
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Supabase Storage</span>
                {systemStatus.supabase ? (
                  <span className="flex items-center gap-1 text-emerald-500 font-bold">
                    <CheckCircle2 size={14} /> Configured
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-500 font-bold">
                    <AlertCircle size={14} /> Missing config
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Admin Access</span>
                {systemStatus.firebaseAdmin ? (
                  <span className="flex items-center gap-1 text-emerald-500 font-bold">
                    <CheckCircle2 size={14} /> Authorized
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-500 font-bold">
                    <AlertCircle size={14} /> Unauthorized
                  </span>
                )}
              </div>
            </div>
            {(!systemStatus.supabase || !systemStatus.firebaseAdmin) && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30 font-bold">
                <p className="text-[10px] text-red-600 dark:text-red-400 leading-relaxed uppercase tracking-widest">
                  {!systemStatus.supabase && "• Supabase config missing\n"}
                  {!systemStatus.firebaseAdmin && "• Administrator record not found"}
                </p>
              </div>
            )}
          </div>

          <div className="glass p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
            <h4 className="font-bold mb-2">Need Support?</h4>
            <p className="text-sm text-slate-500 leading-relaxed">If you encounter any issues with the dashboard, please contact technical support.</p>
            <button className="mt-4 text-primary font-bold text-sm">Open Help Center</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
