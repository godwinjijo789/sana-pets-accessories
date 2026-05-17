import React, { useState, useEffect } from 'react';
import { 
  getPets, 
  addPet, 
  updatePet, 
  deletePet 
} from '../../services/firebaseService';
import { uploadMultipleImages, deleteImage } from '../../services/supabaseService';
import { Pet } from '../../types';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Image as ImageIcon, 
  Loader2, 
  PawPrint,
  Check,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

const ManagePets: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Pet, 'id' | 'createdAt'>>({
    name: '',
    breed: '',
    age: '',
    gender: 'Male',
    vaccination: 'Up to date',
    price: 0,
    description: '',
    images: [],
    availability: true
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    setLoading(true);
    const data = await getPets();
    setPets(data || []);
    setLoading(false);
  };

  const handleOpenModal = (pet?: Pet) => {
    if (pet) {
      setEditingId(pet.id!);
      setFormData({
        name: pet.name,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        vaccination: pet.vaccination,
        price: pet.price,
        description: pet.description,
        images: pet.images,
        availability: pet.availability
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        breed: '',
        age: '',
        gender: 'Male',
        vaccination: 'Up to date',
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
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await deletePet(id);
        // Also delete images from storage
        await Promise.all(images.map(url => deleteImage(url)));
        toast.success('Pet deleted successfully');
        fetchPets();
      } catch (error) {
        toast.error('Failed to delete pet');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let finalImages = [...formData.images];
      
      // Upload new images if any
      if (imageFiles.length > 0) {
        const uploadedUrls = await uploadMultipleImages(imageFiles, 'pets');
        finalImages = [...finalImages, ...uploadedUrls];
      }

      if (finalImages.length === 0) {
        toast.error('Please add at least one image.');
        setSubmitting(false);
        return;
      }

      if (editingId) {
        await updatePet(editingId, { ...formData, images: finalImages });
        toast.success('Pet updated successfully');
      } else {
        await addPet({ ...formData, images: finalImages });
        toast.success('Pet added successfully');
      }

      setIsModalOpen(false);
      fetchPets();
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
        toast.error('Max 5 images allowed');
        return;
      }
      setImageFiles([...imageFiles, ...files]);
    }
  };

  const removeExistingImage = (url: string) => {
    setFormData({ ...formData, images: formData.images.filter(img => img !== url) });
  };

  const filteredPets = pets.filter(pet => 
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold italic">Manage Pets</h1>
          <p className="text-slate-500">Add, edit or remove animals from your shop.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Add New Pet</span>
        </button>
      </div>

      <div className="glass p-4 rounded-3xl flex items-center gap-4">
        <Search className="text-slate-400 ml-2" size={20} />
        <input 
          type="text" 
          placeholder="Search by name or breed..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none w-full font-medium"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 glass animate-pulse rounded-3xl" />)
        ) : (
          <>
            {filteredPets.map((pet) => (
              <motion.div 
                layout
                key={pet.id} 
                className="glass rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-primary/20"
              >
                <div className="h-48 relative overflow-hidden">
                  <img src={pet.images[0]} alt={pet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">
                    {pet.breed}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold font-serif">{pet.name}</h3>
                      <p className="text-slate-500 text-sm">{pet.gender} • {pet.age}</p>
                    </div>
                    <span className="text-primary font-bold">Rs. {pet.price}</span>
                  </div>
                  <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                    <button 
                      onClick={() => handleOpenModal(pet)}
                      className="p-2 glass text-blue-500 hover:bg-blue-500 hover:text-white transition-all rounded-xl"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(pet.id!, pet.images)}
                      className="p-2 glass text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-xl"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredPets.length === 0 && (
              <div className="col-span-full py-20 text-center glass rounded-3xl">
                <PawPrint size={64} className="mx-auto text-slate-200 mb-2" />
                <p className="text-slate-400 font-bold">No pets found</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass p-10 rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-2 glass hover:text-red-500 transition-colors rounded-xl"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-serif font-bold italic mb-8">
                {editingId ? 'Edit Pet Info' : 'Register New Pet'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Pet Name *</label>
                    <input 
                      type="text" required
                      className="w-full glass bg-white/30 dark:bg-slate-900/30 px-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Breed *</label>
                    <input 
                      type="text" required
                      className="w-full glass bg-white/30 dark:bg-slate-900/30 px-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border"
                      placeholder="e.g. Golden Retriever"
                      value={formData.breed}
                      onChange={(e) => setFormData({...formData, breed: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Age</label>
                    <input 
                      type="text" 
                      className="w-full glass bg-white/30 dark:bg-slate-900/30 px-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border"
                      placeholder="e.g. 3 Months"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Gender</label>
                    <select 
                      className="w-full glass bg-white/30 dark:bg-slate-900/30 px-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border"
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
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
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Vaccination Info</label>
                  <input 
                    type="text" 
                    className="w-full glass bg-white/30 dark:bg-slate-900/30 px-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border"
                    value={formData.vaccination}
                    onChange={(e) => setFormData({...formData, vaccination: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-bold ml-1">Description *</label>
                   <textarea 
                    required rows={4}
                    className="w-full glass bg-white/30 dark:bg-slate-900/30 px-6 py-4 rounded-2xl outline-none focus:border-primary border-transparent border resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                   />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 flex items-center justify-between">
                    <span>Images (Up to 5) *</span>
                    <span className="text-[10px] text-slate-400">{formData.images.length + imageFiles.length} / 5</span>
                  </label>
                  
                  <div className="grid grid-cols-5 gap-4">
                    {/* Existing Images */}
                    {formData.images.map((url, i) => (
                      <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200">
                        <img src={url} alt="pet" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeExistingImage(url)}
                          className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {/* New Files */}
                    {imageFiles.map((file, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-primary/30 flex items-center justify-center bg-primary/5">
                        <ImageIcon size={20} className="text-primary" />
                        <button 
                          type="button"
                          onClick={() => setImageFiles(imageFiles.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 p-1 bg-white rounded-full text-red-500 shadow-sm"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {/* Add Button */}
                    {(formData.images.length + imageFiles.length < 5) && (
                      <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center cursor-pointer">
                        <Plus className="text-slate-400" size={20} />
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="flex-grow btn-primary py-4 flex items-center justify-center gap-3"
                  >
                    {submitting ? <Loader2 size={24} className="animate-spin" /> : editingId ? <Check size={24} /> : <Plus size={24} />}
                    {submitting ? 'Processing...' : editingId ? 'Update Pet' : 'Register Pet'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManagePets;
