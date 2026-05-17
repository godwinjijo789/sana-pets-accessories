import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export const uploadMultipleImages = async (files: File[], folder: 'pets' | 'accessories') => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
  }

  const supabase = getSupabase();
  const uploadPromises = files.map(async (file) => {
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('pet-shop-images')
      .upload(filePath, file);

    if (error) {
      if (error.message === 'Bucket not found') {
        throw new Error('Supabase bucket "pet-shop-images" not found. Please create a public bucket named "pet-shop-images" in your Supabase dashboard.');
      }
      if (error.message.includes('new row violates row-level security policy')) {
        throw new Error('Supabase storage policy restriction. Please ensure your "pet-shop-images" bucket has a policy allowing "INSERT" (and ideally "SELECT", "UPDATE", "DELETE") for "anon" and "authenticated" roles.');
      }
      console.error('Upload error:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('pet-shop-images')
      .getPublicUrl(filePath);

    return publicUrl;
  });

  return Promise.all(uploadPromises);
};

export const deleteImage = async (url: string) => {
  if (!isSupabaseConfigured()) return;

  try {
    const supabase = getSupabase();
    // Extract path from public URL
    // Public URL format: https://[project].supabase.co/storage/v1/object/public/pet-shop-images/pets/123-file.png
    const path = url.split('/public/pet-shop-images/')[1] || url.split('/pet-shop-images/')[1];
    if (!path) return;

    const { error } = await supabase.storage
      .from('pet-shop-images')
      .remove([path]);

    if (error) {
      console.error('Delete image error:', error);
    }
  } catch (error) {
    console.error('Unexpected error deleting image:', error);
  }
};
