import React, { useState, useEffect } from 'react';
import { 
  getEnquiries, 
  markEnquiryAsRead, 
  deleteEnquiry 
} from '../../services/firebaseService';
import { Enquiry } from '../../types';
import { 
  Search, 
  Mail, 
  Phone, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  User,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

const ManageEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    const data = await getEnquiries();
    setEnquiries(data || []);
    setLoading(false);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markEnquiryAsRead(id);
      fetchEnquiries();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this enquiry?')) {
      try {
        await deleteEnquiry(id);
        toast.success('Enquiry deleted');
        fetchEnquiries();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const filteredEnquiries = enquiries.filter(enq => 
    enq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enq.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold italic">Customer Enquiries</h1>
        <p className="text-slate-500">Manage questions and adoption requests from your visitors.</p>
      </div>

      <div className="glass p-4 rounded-3xl flex items-center gap-4">
        <Search className="text-slate-400 ml-2" size={20} />
        <input 
          type="text" 
          placeholder="Search enquiries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none w-full font-medium"
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-24 glass animate-pulse rounded-2xl" />)
        ) : (
          <>
            {filteredEnquiries.map((enq) => (
              <motion.div 
                key={enq.id}
                layout
                className={`glass border rounded-[2rem] overflow-hidden transition-all duration-300 ${
                  enq.status === 'unread' ? 'border-primary/30 border-l-4 border-l-primary' : 'border-transparent'
                }`}
              >
                <div 
                  className="p-6 cursor-pointer flex flex-wrap items-center justify-between gap-6"
                  onClick={() => setExpandedId(expandedId === enq.id ? null : enq.id!)}
                >
                  <div className="flex items-center gap-4 min-w-[250px]">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      enq.status === 'unread' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <User size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold flex items-center gap-2">
                        {enq.name}
                        {enq.status === 'unread' && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                      </h4>
                      <p className="text-sm text-slate-500">{enq.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm">
                      <Clock size={16} />
                      <span>{formatDate(enq.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {enq.status === 'unread' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleMarkAsRead(enq.id!); }}
                          className="p-2 glass text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all"
                          title="Mark as read"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(enq.id!); }}
                        className="p-2 glass text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="p-2 glass text-slate-400">
                         {expandedId === enq.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === enq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                           <div className="flex items-center gap-3">
                             <Phone size={18} className="text-primary" />
                             <span className="font-medium">{enq.phone || 'No phone provided'}</span>
                           </div>
                           <div className="flex items-center gap-3">
                             <Mail size={18} className="text-primary" />
                             <span className="font-medium">{enq.email}</span>
                           </div>
                        </div>
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <MessageSquare size={14} />
                            Full Message
                          </h5>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {enq.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            {filteredEnquiries.length === 0 && (
              <div className="py-20 text-center glass rounded-3xl">
                <MessageSquare size={64} className="mx-auto text-slate-200 mb-2" />
                <p className="text-slate-400 font-bold">No enquiries found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManageEnquiries;
