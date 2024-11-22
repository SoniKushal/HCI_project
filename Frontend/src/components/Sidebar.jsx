import React from 'react';
import { Link, useLocation , useNavigate } from 'react-router-dom';
import { FaClipboardList, FaEnvelope, FaChartPie, FaBox, FaSignOutAlt, FaUser } from 'react-icons/fa'; // Import necessary icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShop } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from './auth-context';

const Sidebar = () => {
  const location = useLocation(); // Get current location
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = ()=>{
    logout();
    navigate('/login');
  }
  return (
    <aside className="w-64 h-screen bg-white p-4 md:w-48 sm:w-full">
      
      {/* Logo Section */}
      <div className="flex items-center mb-8 mt-8 lg:mt-auto">
        <img src="/logo.jpg" alt="logo" className="w-40 h-20" />
      </div>

      {/* Navigation Links Section */}
      <nav className="flex flex-col space-y-10 mt-20"> {/* Increased spacing between links */}
        <Link 
          to="/ownerdashboard" 
          className={`flex items-center w-40 h-10 text-xl hover:text-red-600 hover:font-semibold hover:delay-150 ${location.pathname === '/ownerdashboard' || location.pathname === '/ownerrestaurant'  ? 'text-red-600 font-semibold border rounded-md border-2 border-red-600 ring-2 ring-red-600' : 'text-black'}`} // Highlight active link
        >
          <FaClipboardList className="ml-6 mr-2" /> Home
        </Link>
        <Link 
          to="/messages" 
          className={`flex items-center w-40 h-10 text-xl hover:text-red-600 hover:font-semibold hover:delay-150 ${location.pathname === '/messages' ? 'text-red-600' : 'text-black'}`}
        >
          <FaEnvelope className="ml-6 mr-2" /> Messages
        </Link>
        <Link 
          to="/statistics" 
          className={`flex items-center w-40 h-10 text-xl hover:text-red-600 hover:font-semibold hover:delay-150 ${location.pathname === '/statistics' ? 'text-red-600' : 'text-black'}`}
        >
          <FaChartPie className="ml-6 mr-2" />Statistics
        </Link>
        <Link 
          to="/products" 
          className={`flex items-center w-40 h-10 text-xl hover:text-red-600 hover:font-semibold hover:delay-150 ${location.pathname === '/products' ? 'text-red-600' : 'text-black'}`}
        >
          <FaBox className="ml-6 mr-2" /> Products
        </Link>
        <Link 
          to="/ownerprofile" 
          className={`flex items-center w-40 h-10 text-xl hover:text-red-600 hover:font-semibold hover:delay-150 ${location.pathname === '/ownerprofile' ? 'text-red-600 font-semibold border rounded-md border-2 border-red-600 ring-2 ring-red-600' : 'text-black'}`}
        >
          <FaUser className="ml-6 mr-2" /> Profile
        </Link>
      </nav>

      {/* Logout Section */}
      <div className="mb-auto mt-32 pt-auto">
      <button 
          onClick={handleLogout}
          className="flex items-center text-black text-xl hover:font-semibold hover:delay-150 hover:text-red-500"
        >
          <FaSignOutAlt className="ml-6 mr-2" /> Log Out
      </button>
      </div>
    </aside>
  );
};

export default Sidebar;