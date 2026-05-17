import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Pets from './pages/public/Pets';
import PetDetails from './pages/public/PetDetails';
import Accessories from './pages/public/Accessories';
import AccessoryDetails from './pages/public/AccessoryDetails';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import AdminLogin from './pages/admin/Login';

// Admin Pages
import { ProtectedRoute } from './components/common/ProtectedRoute';
import Dashboard from './pages/admin/Dashboard';
import ManagePets from './pages/admin/ManagePets';
import ManageAccessories from './pages/admin/ManageAccessories';
import ManageEnquiries from './pages/admin/ManageEnquiries';
import ManageReviews from './pages/admin/ManageReviews';
import AdminSettings from './pages/admin/AdminSettings';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/pets" element={<Pets />} />
              <Route path="/pets/:id" element={<PetDetails />} />
              <Route path="/accessories" element={<Accessories />} />
              <Route path="/accessories/:id" element={<AccessoryDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/pets" element={<ManagePets />} />
                <Route path="/admin/accessories" element={<ManageAccessories />} />
                <Route path="/admin/enquiries" element={<ManageEnquiries />} />
                <Route path="/admin/reviews" element={<ManageReviews />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
