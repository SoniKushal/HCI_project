import React, { useState } from 'react';
import Sidebar from '../components/Sidebar'; // Import Sidebar component
import Header from '../components/OwnerHeader'; // Import Header component
import RestaurantCard from '../components/RestaurantCard'; // Import RestaurantCard component

const OwnerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const restaurants = [
    {
      id: 1,
      name: 'The Spice Room',
      address: '123 Main Street, City',
      rating: 4.5,
      image: 'src/assets/restaurant1.jpg',
    },
    {
      id: 2,
      name: 'La Piazza',
      address: '456 Elm Street, City',
      rating: 4.7,
      image: 'src/assets/restaurant2.jpg',
    },
    {
      id: 3,
      name: 'Sushi World',
      address: '789 Ocean Drive, City',
      rating: 4.8,
      image: 'src/assets/restaurant2.jpg',
    },
    {
      id: 4,
      name: 'The Spice Room',
      address: '123 Main Street, City',
      rating: 4.5,
      image: 'src/assets/restaurant1.jpg',
    },
    {
      id: 5,
      name: 'La Piazza',
      address: '456 Elm Street, City',
      rating: 4.7,
      image: 'src/assets/restaurant2.jpg',
    },
  ];

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      
      {/* Sidebar is always visible on larger screens */}
      <div className={`fixed top-0 z-50 left-0 w-64 h-screen bg-white p-4 transition-transform duration-300 ${!isSidebarOpen ? "block" : "hidden"}`}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className={`p-4 bg-gray-100 lg:ml-64 transition-all duration-300`}>
        <h1 className="text-xl font-bold mb-6">My Restaurants</h1>

        {/* Restaurant Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="w-full h-[320px] ">
              <RestaurantCard {...restaurant} />
            </div>
          ))}

          {/* Add Restaurant Option */}
          <div className="w-72 h-72 m-2 flex justify-center items-center bg-gray-100">
            <div className="flex justify-center items-center w-full h-full">
              <div className="flex justify-center items-center w-[80px] h-[80px] border border-gray-400 rounded-full bg-white transition ease-in-out delay-150 hover:scale-110 hover:border-red-600 text-red-600 cursor-pointer">
                <span className="text-5xl font-bold text-gray-600 hover:text-red-500">+</span>
              </div>
            </div>
          </div>
        </div>
        
      </main>
    </>
  );
};

export default OwnerDashboard;