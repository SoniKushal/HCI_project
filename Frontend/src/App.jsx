import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import Dashboard from './pages/OwnerDashboard';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AddRestaurantForm from './components/AddRestaurantForm';
import SigninForm from './pages/LoginPage';
import OwnerRestaurant from './pages/OwnerRestaurant';
import ResetPassword from './pages/ResetPassword';
import { AuthProvider } from './components/auth-context';
import AuthMiddleware from './components/AuthMiddleware';

function App() {
  return (
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
            <Route path="/bookings" element={<Bookings />} />

            {/* Owner Routes */}
            <Route path="/ownerdashboard" element={<Dashboard />} />
            <Route path="/addrestaurant" element={<AddRestaurantForm />} />
            <Route path="/ownerrestaurant/:restaurantId" element={<OwnerRestaurant />} />

            {/* Shared Routes */}
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </AuthMiddleware>
      </AuthProvider>
    </Router>
  );
}

export default App;