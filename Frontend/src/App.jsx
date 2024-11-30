import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Reservation from './pages/Reservations';
import Dashboard from './pages/OwnerDashboard';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AddRestaurantForm from './components/AddRestaurantForm';
import SigninForm from './pages/LoginPage';
import OwnerRestaurant from './pages/OwnerRestaurant';
import OwnerProfile from './pages/OwnerProfile';
import ResetPassword from './pages/ResetPassword';
import { AuthProvider } from './components/auth-context';
import AuthMiddleware from './components/AuthMiddleware';
import Bookings from './pages/Bookings';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#22c55e',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      <Router>
        <AuthProvider>
          <AuthMiddleware>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<SigninForm />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Customer Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/reservations" element={<Reservation />} />
              <Route path="/reservations/:id" element={<Reservation />} />

              {/* Owner Routes */}
              <Route path="/ownerdashboard" element={<Dashboard />} />
              <Route path="/addrestaurant" element={<AddRestaurantForm />} />
              <Route path="/ownerrestaurant/:id" element={<OwnerRestaurant />} />
              <Route path="/ownerprofile" element={<OwnerProfile />} />

              {/* Shared Routes */}
              <Route path="/profile" element={<Profile />} />

              {/* Bookings Route */}
              <Route path="/bookings" element={<Bookings />} />
            </Routes>
          </AuthMiddleware>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;