import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar'; // Import Sidebar component
import Header from '../components/OwnerHeader'; // Import Header component
import BookingCard from '../components/BookingCard'; // Import BookingCard component
import AddRestaurantForm from '../components/AddRestaurantForm'; // Import AddRestaurantForm component
import Slider from '../components/Slider'; // Import Slider component
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import { useParams , useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/auth-context'; // Import useAuth
import toast from 'react-hot-toast';


// Add this cuisine image mapping
const cuisineImages = {
  'Italian': 'italian.jpg',
  'Chinese': 'chinese.jpg',
  'Indian': 'indian.jpg',
  'Mexican': 'mexican.jpg',
  'Japanese': 'japanese.jpg',
  'South Indian': 'south-indian.jpg'
};

const OwnerRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from auth context
  const [restaurant, setRestaurant] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleFormOpen = () => setIsFormOpen(true);
  const handleFormClose = () => setIsFormOpen(false);
  const [bookings, setBookings] = useState([...Array(20)].map((_, index) => ({
    id: index,
    name: 'Sample Name',
    phone: '1234567890',
    bookingTime: '12:00 PM',
    arrivalTime: '12:30 PM',
    tables: '2x2p, 1x4p',
    totalPeople: 8,
  })));

  const [cancelingBookingId, setCancelingBookingId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');

  const handleCancelClick = (id) => {
    setCancelingBookingId(id);
    setCancellationReason(''); // Reset reason when opening modal
  };

  const handleConfirmCancel = () => {
    const wordCount = cancellationReason.trim().split(/\s+/).length;
    if (wordCount < 10) {
      alert('Please provide at least 10 words for the cancellation reason.');
      return;
    }

    setBookings(prevBookings => prevBookings.filter(booking => booking.id !== cancelingBookingId));
    alert(`Booking ID ${cancelingBookingId} has been cancelled. Reason: ${cancellationReason}`);
    
    // Close the modal
    setCancelingBookingId(null);
  };

  const handleCloseModal = () => {
    setCancelingBookingId(null);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false); // Sidebar open by default for larger screens
      } else {
        setIsSidebarOpen(true); // Sidebar hidden by default for smaller screens
      }
    };

    handleResize(); // Set the initial state
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      toast.error('Please login to view restaurant details');
      navigate('/login');
      return;
    }
    
    fetchRestaurantDetails();
  }, [id, user, navigate]);

  const fetchRestaurantDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/restaurant/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.data || !response.data.restaurantData) {
        throw new Error('Invalid response data structure');
      }

      const data = response.data.restaurantData;

      // Transform the data with proper URL construction and handle cuisines
      const restaurantData = {
        ...data,
        cuisines: Array.isArray(data.cuisines) 
          ? data.cuisines 
          : typeof data.cuisines === 'string'
            ? data.cuisines.split(',').map(c => c.trim())
            : [],
        image: Array.isArray(data.image) && data.image.length > 0
          ? data.image.map(img => img.startsWith('http') 
              ? img 
              : `${import.meta.env.VITE_BACKEND_URL}/restaurant/images/${img}`)
          : [],
        menuImage: Array.isArray(data.menuImage) && data.menuImage.length > 0
          ? data.menuImage.map(img => img.startsWith('http')
              ? img
              : `${import.meta.env.VITE_BACKEND_URL}/restaurant/images/${img}`)
          : [],
        ambianceImage: Array.isArray(data.ambianceImage) && data.ambianceImage.length > 0
          ? data.ambianceImage.map(img => img.startsWith('http')
              ? img
              : `${import.meta.env.VITE_BACKEND_URL}/restaurant/images/${img}`)
          : [],
      };

      setRestaurant(restaurantData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      handleError(error);
    }
  };

  // Add interceptor to handle token expiration globally
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  const addRestaurant = (newRestaurant) => {
    setRestaurant(newRestaurant);
  }
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/restaurant/delete/${restaurant._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assumes you have a JWT token stored
        },
      });
      if (response.status === 200) {
        console.log("Restaurant deleted successfully");
        navigate("/ownerdashboard"); // Redirect after successful deletion
      }
    } catch (error) {
      console.error("Failed to delete restaurant:", error.response?.data?.message || error.message);
      if (error.response && error.response.status === 401) {
        // Token has expired, redirect to login page
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <div className={`fixed top-0 z-50 left-0 w-64 h-screen bg-white p-4 transition-transform duration-300 ${!isSidebarOpen ? "block" : "hidden"} `}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="p-4 bg-gray-100 lg:ml-64 transition-all duration-300">
        <h1 className="text-xl font-bold mb-6">Restaurant Details</h1>

        {/* Bookings Section */}
        <h1 className="text-xl font-bold mb-6">Current Bookings</h1>
        <div className="overflow-x-auto">
          <div className="flex space-x-4 mb-4 mt-4">
            {bookings.map((booking) => (
              <div className="min-w-[250px] sm:min-w-[300px] lg:min-w-[350px]" key={booking.id}>
                <BookingCard
                  booking={booking}
                  onCancel={() => handleCancelClick(booking.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Restaurant Information Section */}
        <div className="bg-white my-4 shadow-lg rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Left Column: Basic Info */}
          <div className="col-span-1">
            <h2 className="text-2xl font-bold mb-2">{restaurant.name}</h2>
            {/* <p className="text-gray-600 mb-1">
              <FaStar className="inline text-yellow-500" /> {restaurant.rating} / 5
            </p> */}
            <p className="text-gray-600 mb-1">Phone: {restaurant.phoneNumber}</p>
            <p className="text-gray-600">Location: {restaurant.location}</p>
          </div>

          {/* Capacity and Hours Columns */}
          <div className="col-span-1">
            <h3 className="font-bold text-lg mb-2">Capacity</h3>
            <p>2-Person Tables: {restaurant.capacity.twoPerson}</p>
            <p>4-Person Tables: {restaurant.capacity.fourPerson}</p>
            <p>6-Person Tables: {restaurant.capacity.sixPerson}</p>
          </div>

          <div className="col-span-1">
            <h3 className="font-bold text-lg mb-2">Hours</h3>
            <p>Opening: {`${restaurant.openingTime}`}</p>
            <p>Closing: {`${restaurant.closingTime}`}</p>
          </div>

          {/* Edit/Delete Column */}
          <div className="col-span-1 flex space-x-4 justify-self-end">
            <button
              onClick={handleFormOpen}
              className="text-accent hover:text-green-700 flex items-center"
            >
              <FaEdit className="mr-2" /> Edit
            </button>

            {isFormOpen && (
              <AddRestaurantForm
                onClose={handleFormClose}
                restaurantData={restaurant} // Pass existing restaurant data here
                isEditing={true}
                addRestaurant={addRestaurant}
                className='z-40'
              />
            )}

            <button
              className="text-red-500 hover:text-red-700 flex items-center"
              onClick={handleDelete}
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </div>
        </div>

        {/* Cuisines Section */}
        <div className="my-8 px-2">
          <h2 className="text-2xl mb-2 font-semibold">Cuisines</h2>
          <div className="flex items-center justify-start gap-4 overflow-x-auto">
            {restaurant.cuisines && restaurant.cuisines.map((cuisine) => (
              <div
                key={cuisine}
                className="bg-white shadow-md p-4 rounded-lg flex items-center flex-shrink-0"
                style={{ minWidth: '200px' }}
              >
                <img 
                  src={`/src/assets/${cuisineImages[cuisine] || 'default-cuisine.jpg'}`} 
                  alt={cuisine} 
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/src/assets/default-cuisine.jpg';
                  }}
                />
                <div className="ml-3 font-medium">{cuisine}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Image Slider */}
        {restaurant.menuImage && restaurant.menuImage.length > 0 && (
          <>
            <h2 className='text-2xl font-semibold my-4'>Menu</h2>
            <Slider images={restaurant.menuImage} slidesToShow={3} />
          </>
        )}

        {/* Ambience Image Slider */}
        {restaurant.image && restaurant.image.length > 0 && (
          <div className='my-2 z-0'>
            <h2 className='text-2xl font-semibold'>Ambience Images</h2>
            <Slider images={restaurant.image} slidesToShow={2} />
          </div>
        )}
      </main>
    </>
  );
};

export default OwnerRestaurant;