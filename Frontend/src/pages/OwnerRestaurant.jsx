import React, { useState } from 'react';
import Sidebar from '../components/Sidebar'; // Import Sidebar component
import Header from '../components/OwnerHeader'; // Import Header component
import BookingCard from '../components/BookingCard'; // Import BookingCard component
import AddRestaurantForm from '../components/AddRestaurantForm'; // Import AddRestaurantForm component
import CuisineList from '../components/CuisineList'; // Import CuisineList component
import Slider from '../components/Slider'; // Import Slider component
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import MenuSlider from '../components/MenuSlider';

const OwnerRestaurant = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleFormOpen = () => setIsFormOpen(true);
  const handleFormClose = () => setIsFormOpen(false);

  // Sample restaurant data
  const restaurant = {
    id: 1,
    name: 'The Spice Room',
    rating: 4.5,
    cuisines: ['Indian', 'Chinese', 'Italian', 'Japanese', 'Mexican', 'South-Indian'],
    menuImages:['src/assets/menu1.jpg','src/assets/menu2.jpg','src/assets/menu3.jpg','src/assets/menu4.jpg','src/assets/menu5.jpg','src/assets/menu6.jpg'],
    phoneNumber: '1234567890',
    ambienceImages: ['src/assets/restaurant1.jpg', 'src/assets/restaurant2.jpg', 'src/assets/restaurant1.jpg', 'src/assets/restaurant2.jpg'],
    location: '123 Main Street, City',
    capacity: { twoPerson: 5, fourPerson: 10, sixPerson: 3 },
    openingHours: { openHour: '09', openMinute: '00', closeHour: '22', closeMinute: '30' },
  };

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />

      {/* Sidebar is always visible on larger screens */}
      <div className={`fixed top-0 z-50 left-0 w-64 h-screen bg-white p-4 transition-transform duration-300 ${!isSidebarOpen ? "block" : "hidden"} `}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="p-4 bg-gray-100 lg:ml-64 transition-all duration-300">
        <h1 className="text-xl font-bold mb-6">Restaurant Details</h1>

        {/* Restaurant Information Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Left Column: Basic Info */}
          <div className="col-span-1">
            <h2 className="text-2xl font-bold mb-2">{restaurant.name}</h2>
            <p className="text-gray-600 mb-1">
              <FaStar className="inline text-yellow-500" /> {restaurant.rating} / 5
            </p>
            <p className="text-gray-600 mb-1">Phone: {restaurant.phoneNumber}</p>
            <p className="text-gray-600">Location: {restaurant.location}</p>
          </div>

          {/* Capacity and Hours Columns (Responsive Behavior) */}
          <div className="col-span-1 sm:col-span-1 md:col-span-1">
            <h3 className="font-bold text-lg mb-2">Capacity</h3>
            <p>2-Person Tables: {restaurant.capacity.twoPerson }</p>
            <p>4-Person Tables: {restaurant.capacity.fourPerson}</p>
            <p>6-Person Tables: {restaurant.capacity.sixPerson}</p>
          </div>
          
          <div className="col-span-1 sm:col-span-1 md:col-span-1">
            <h3 className="font-bold text-lg mb-2">Hours</h3>
            <p>Opening: {`${restaurant.openingHours.openHour}:${restaurant.openingHours.openMinute}`}</p>
            <p>Closing: {`${restaurant.openingHours.closeHour}:${restaurant.openingHours.closeMinute}`}</p>
          </div>

          {/* Edit/Delete Column */}
          <div className="col-span-1 flex space-x-4 justify-self-end">
            {/* <div className="owner-restaurant-container"> */}
              <button 
                onClick={handleFormOpen} 
                className="text-accent hover:text-green-700 flex items-center"
              >
                <FaEdit className="mr-2" />Edit
              </button>

              {isFormOpen && (
                <AddRestaurantForm 
                  onClose={handleFormClose} 
                  restaurantData={restaurant} // Pass existing restaurant data here
                  className='z-40'/>
              )}
            {/* </div> */}
            <button
              className="text-red-500 hover:text-red-700 flex items-center"
              onClick={() => {
                // Backend integration for deleting restaurant
                console.log("Delete restaurant", restaurant.id);
              }}
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </div>
        </div>
        {/* Bookings Section */}
       <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mb-4 mt-4">
         {/* Replace with real booking data if available */}
         {[...Array(6)].map((_, index) => (
          <BookingCard key={index} booking={{ id: index, name: 'Sample Name', phone: '1234567890', bookingTime: '12:00 PM', arrivalTime: '12:30 PM', tables: '2x2p, 1x4p', totalPeople: 8 }} />
        ))}
      </div>

      {/* Ambience Image Slider */}
      <div className='my-2 z-0'>
        <h2 className='text-2xl font-semibold'>Ambience Images</h2>
        <Slider images={restaurant.ambienceImages} slidesToShow={2} />
      </div>
      

      {/* Cuisines Section */}
      <div className="my-8 px-2">
      <h2 className="text-2xl mb-2">Cuisines</h2>
      <div className="flex items-center justify-center text-base">
        {restaurant.cuisines.map((cuisine) => (
          <div
            key={cuisine.name}
            className="bg-white shadow-md p-4 m-2 rounded-lg cursor-pointer hover:bg-gray-200 flex items-center justify-between"
            style={{ width: '20%' }} // Two items per row with some spacing
          >
            <img src={`src/assets/${cuisine}.jpg `}alt={cuisine} className="w-12 h-12 mr-2 rounded-full" /> {/* Placeholder for images */}
            <div className="mx-2">
              {cuisine}
            </div>
          </div>
        ))}
      </div>
    </div>


       {/* Menu Image Slider */}
       <h2 className='text-2xl font-semibold'>Menu</h2>
      {/* <MenuSlider className='h-64'/> */}
      <Slider images={restaurant.menuImages} slidesToShow={3} />
      </main>
    </>
  );
};

export default OwnerRestaurant;
