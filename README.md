# Sana Pets & Accessories

A premium, modern pet store web application built with React, Firebase, and Supabase.

## Features

- **Premium Design**: Modern UI with glassmorphism, smooth animations, and elegant typography.
- **Dynamic Catalog**: Full showcase of available pets and high-quality accessories.
- **Admin Dashboard**: Comprehensive panel to manage inventory, enquiries, and reviews.
- **Real-time Reviews**: Instant feedback system for accessory products.
- **Cloud Integration**: 
  - **Firebase**: Authentication, Firestore Database, and Security Rules.
  - **Supabase**: High-performance image storage and retrieval.
- **Responsive & Accessible**: Mobile-first design with Dark/Light mode support.

## Tech Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Database/Auth**: Firebase (Firestore & Auth)
- **Storage**: Supabase Storage
- **Routing**: React Router 7

## Setup Instructions

### Firebase Setup
1. Use the provided `firebase-applet-config.json` (already configured via tool).
2. Deploy Firestore Rules:
   ```bash
   # Rules are ready in firestore.rules
   ```

### Supabase Storage Setup
1. Create a project at [supabase.com](https://supabase.com).
2. Create a public bucket named `pet-shop-images`.
3. Set up the following subfolders: `pets/`, `accessories/`.
4. Configure Storage Policies for public read:
   ```sql
   -- Allow public read access to pet-shop-images
   CREATE POLICY "Public Read" ON storage.objects FOR SELECT USING (bucket_id = 'pet-shop-images');
   ```

### Deployment
The app is optimized for Vercel/Cloud Run. Ensure all environment variables from `.env.example` are set in your deployment platform.

## Admin Access
To access the admin dashboard:
1. Navigate to Footer > Admin Login.
2. Sign in with your registered Google account (`godwinjijo789@gmail.com`).
3. The system is configured to automatically authorize this specific account as the primary administrator on first login. Other admin accounts must be added by an existing administrator.

## Development
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

---
© 2026 Sana Pets & Accessories
