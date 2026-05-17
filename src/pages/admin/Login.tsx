import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  browserSessionPersistence,
  setPersistence
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { motion } from 'motion/react';
import { LogIn, ShieldCheck, PawPrint, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await setPersistence(auth, browserSessionPersistence);
      const result = await signInWithPopup(auth, provider);
      
      const user = result.user;
      const userEmail = user.email?.toLowerCase();
      const adminDocRef = doc(db, 'admins', user.uid);
      let adminDoc = await getDoc(adminDocRef);
      
      // Auto-bootstrap for specific authorized emails
      const authorizedEmails = ['godwinjijo789@gmail.com', 'mohdsajith2005@gmail.com'];
      
      if (!adminDoc.exists() && userEmail && authorizedEmails.includes(userEmail)) {
        console.log('Bootstrapping admin account for:', userEmail);
        try {
          const { setDoc, serverTimestamp } = await import('firebase/firestore');
          await setDoc(adminDocRef, {
            email: userEmail,
            name: user.displayName || 'Administrator',
            role: 'owner', // Both are owners as requested
            createdAt: serverTimestamp()
          });
          // Verify it was created
          adminDoc = await getDoc(adminDocRef);
        } catch (bootstrapErr) {
          console.error('Bootstrap failed:', bootstrapErr);
        }
        adminDoc = await getDoc(adminDocRef);
      }
      
      if (adminDoc.exists()) {
        toast.success('Welcome back, Admin!');
        navigate('/admin/dashboard');
      } else {
        await auth.signOut();
        toast.error('Access denied. This account is not registered as an administrator.');
      }
    } catch (error: any) {
      console.error(error);
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 flex items-center justify-center container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-2">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-3xl font-serif font-bold italic">Admin Access</h1>
          <p className="text-slate-500 font-medium text-balance text-center">
            Log in with your authorized Google account to manage Sana Pets.
          </p>
        </div>

        <div className="space-y-6">
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full glass bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-4 border border-slate-200 dark:border-slate-800 group"
          >
            {loading ? (
              <Loader2 className="animate-spin text-primary" size={24} />
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">
              {loading ? 'Authenticating...' : 'Continue with Google'}
            </span>
          </button>

          <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest px-4">
            Authorized Personnel Only. Access attempts are logged.
          </p>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
          <Link to="/" className="text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-2 text-sm font-medium">
            <PawPrint size={14} />
            Back to Public Site
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

