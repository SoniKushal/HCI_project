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



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/ownerdashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<SigninForm />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/addrestaurant" element={<AddRestaurantForm />} />


      </Routes>
    </Router>
  );
}

export default App;

