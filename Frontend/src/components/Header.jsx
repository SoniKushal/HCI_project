import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUserCircle, FaMapMarkerAlt, FaSearch, FaUser, FaClipboardList } from 'react-icons/fa';
import LocationPopup from './LocationPopup';
import { useAuth } from './auth-context';

const Header = ({ onLocationChange, onSearchChange }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Select Location');
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const locationButtonRef = useRef(null);

  const handleProfileClick = () => {
    if (!user) {
      // Instead of programmatic navigation, use the Link component
      return;
    }
    setShowDropdown(!showDropdown);
  };

  const handleLocationClick = () => {
    setShowLocationPopup(true);
  };

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      window.location.reload();
    }
  };

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
    // No navigation needed - just let the UI update based on auth state
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowLocationPopup(false);
    onLocationChange(location);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (locationButtonRef.current && !locationButtonRef.current.contains(event.target)) {
        setShowLocationPopup(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xl p-4 flex justify-between items-center">
      <Link to="/" onClick={handleHomeClick} className="font-serif bg-secondary ml-4 text-4xl font-bold">
        <img src="/logo.jpg" alt="logo" className="w-35 h-12" />
      </Link>

      <div ref={locationButtonRef} className="relative">
        <button
          onClick={handleLocationClick}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <FaMapMarkerAlt />
          <span className="text-lg">{selectedLocation}</span>
        </button>
        {showLocationPopup && (
          <LocationPopup
            setSelectedLocation={handleLocationSelect}
            closePopup={() => setShowLocationPopup(false)}
          />
        )}
      </div>

      <div className="relative mx-4 w-1/3">
        <input
          type="text"
          placeholder="Search for cities, restaurants, etc."
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 rounded-full w-full py-2 px-4 pl-10 focus:outline-none focus:ring focus:ring-blue-500"
        />
        <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
      </div>

      <div className="relative" ref={dropdownRef}>
        {user ? (
          <>
            <FaUserCircle
              onClick={handleProfileClick}
              className="cursor-pointer w-10 h-10 mx-4 text-gray-600"
            />
            {showDropdown && (
              <div className="absolute shadow-inner-xl right-0 mt-2 pt-2 py-2 w-48 bg-white border-neutral-500 border rounded-lg shadow-xl">
                <Link to="/profile" className="block px-2 py-1 flex items-center text-gray-600 hover:bg-gray-200">
                  <FaUser className="w-6 h-6" />
                  <span className="ml-2">Profile</span>
                </Link>
                <Link to="/bookings" className="block px-2 py-1 flex items-center text-gray-600 hover:bg-gray-200">
                  <FaClipboardList className="w-6 h-6" />
                  <span className="ml-2">Bookings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-2 py-1 flex items-center text-gray-600 hover:bg-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-6">
                    <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"/>
                  </svg>
                  <span className="ml-2">Log Out</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center space-x-4 mx-4">
            <Link 
              to="/login"
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Login
            </Link>
            <Link 
              to="/signup"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;