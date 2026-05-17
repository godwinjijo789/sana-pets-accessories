import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dog, 
  ShoppingBag, 
  MessageSquare, 
  Star, 
  Info,
  LogOut,
  PawPrint,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { title: 'Pets', icon: Dog, path: '/admin/pets' },
    { title: 'Accessories', icon: ShoppingBag, path: '/admin/accessories' },
    { title: 'Enquiries', icon: MessageSquare, path: '/admin/enquiries' },
    { title: 'Reviews', icon: Star, path: '/admin/reviews' },
    { title: 'Contact Settings', icon: Info, path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 h-screen glass border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <PawPrint className="text-white" size={20} />
          </div>
          <span className="font-bold font-serif italic text-lg">Sana Admin</span>
        </NavLink>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
              isActive 
                ? "bg-primary text-white shadow-lg shadow-primary/30" 
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <item.icon size={20} />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <ChevronLeft size={20} />
          <span>Back to Site</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
