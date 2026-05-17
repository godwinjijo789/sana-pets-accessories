import React, { useState, useEffect } from 'react';
import { 
  getAccessories, 
  addAccessory, 
  updateAccessory, 
  deleteAccessory 
} from '../../services/firebaseService';
import { uploadMultipleImages, deleteImage } from '../../services/supabaseService';
import { Accessory } from '../../types';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Loader2, 
  ShoppingBag,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

const ManageAccessories: React.FC = () => {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Accessory, 'id' | 'createdAt'>>({
    name: '',
    category: 'Food',
    price: 0,
    description: '',
    images: [],
    availability: true
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    setLoading(true);
    const data = await getAccessories();
    setAccessories(data || []);
    setLoading(false);
  };

  const handleOpenModal = (item?: Accessory) => {
    if (item) {
      setEditingId(item.id!);
      setFormData({
        name: item.name,
        category: item.category,
        price: item.price,
        description: item.description,
        images: item.images,
        availability: item.availability
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        category: 'Food',
        price: 0,
        description: '',
        images: [],
        availability: true
      });
    }
    setImageFiles([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, images: string[]) => {
    if (window.confirm('Delete this accessory?')) {
      try {
        await deleteAccessory(id);
        await Promise.all(images.map(url => deleteImage(url)));
        toast.success('Accessory deleted');
        fetchAccessories();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let finalImages = [...formData.images];
      
      if (imageFiles.length > 0) {
        const uploadedUrls = await uploadMultipleImages(imageFiles, 'accessories');
        finalImages = [...finalImages, ...uploadedUrls];
      }

      if (finalImages.length === 0) {
        toast.error('Add at least one image');
        setSubmitting(false);
        return;
      }

      if (editingId) {
        await updateAccessory(editingId, { ...formData, images: finalImages });
        toast.success('Updated successfully');
      } else {
        await addAccessory({ ...formData, images: finalImages });
        toast.success('Added successfully');
      }

      setIsModalOpen(false);
      fetchAccessories();
    } catch (error: any) {
      let message = error.message || 'Operation failed';
      try {
        const parsed = JSON.parse(message);
        if (parsed.error) message = parsed.error;
      } catch (e) {
        // Not a JSON error, keep original message
      }
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (formData.images.length + imageFiles.length + files.length > 5) {
        toast.error('Max 5 images');
        return;
      }
      setImageFiles([...imageFiles, ...files]);
    }
  };

  const categories = ['Food', 'Toys', 'Collars', 'Beds', 'Grooming'];

  const filteredItems = accessories.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold italic">Accessories Catalog</h1>
          <p className="text-slate-500">Manage products, food items and grooming tools.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="glass p-4 rounded-3xl flex items-center gap-4">
        <Search className="text-slate-400 ml-2" size={20} />
        <input 
          type="text" 
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none w-full font-medium"
        />
      </div>

      <div className="glass rounded-[2rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100 dark:bg-slate-800/50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Product</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Price</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <tr key={i}><td colSpan={4} className="px-6 py-4 animate-pulse"><div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg"></div></td></tr>
              ))
            ) : (
              <>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                        <h4 className="font-bold">{item.name}</h4>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold uppercase">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">Rs. {item.price}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="p-2 glass text-blue-500 hover:text-blue-600 rounded-xl"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id!, item.images)}
                          className="p-2 glass text-red-500 hover:text-red-600 rounded-xl"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-400">No items available.</td></tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass p-10 rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-2 glass hover:text-red-500 rounded-xl"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-serif font-bold italic mb-8">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Product Name *</label>
                    <input 
                      type="text" required
                      className="w-full glass bg-white/30 dark:bg-slate-900/30 px-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Category *</label>
                    <select 
                      className="w-full glass bg-white/30 dark:bg-slate-900/30 px-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Price (Rs.) *</label>
                  <input 
                    type="number" required
                    className="w-full glass bg-white/30 dark:bg-slate-900/30 px-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-bold ml-1">Product Description *</label>
                   <textarea 
                    required rows={4}
                    className="w-full glass bg-white/30 dark:bg-slate-900/30 px-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                   />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 flex justify-between">
                    <span>Images *</span>
                    <span className="text-[10px] text-slate-400">{formData.images.length + imageFiles.length} / 5</span>
                  </label>
                  <div className="grid grid-cols-5 gap-4">
                    {formData.images.map((url, i) => (
                      <div key={i} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm">
                        <img src={url} alt="product" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, images: formData.images.filter(img => img !== url) })}
                          className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {imageFiles.map((file, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-primary/5 flex items-center justify-center border border-primary/20">
                        <ImageIcon size={20} className="text-primary" />
                        <button type="button" onClick={() => setImageFiles(imageFiles.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-1 bg-white rounded-full text-red-500"><X size={10} /></button>
                      </div>
                    ))}
                    {(formData.images.length + imageFiles.length < 5) && (
                      <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center cursor-pointer">
                        <Plus className="text-slate-400" size={20} />
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-3"
                >
                  {submitting ? <Loader2 size={24} className="animate-spin" /> : editingId ? <Edit2 size={24} /> : <Plus size={24} />}
                  {submitting ? 'Updating...' : editingId ? 'Update Product' : 'Add Product'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageAccessories;
