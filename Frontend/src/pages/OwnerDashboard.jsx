import React,  { useState } from 'react';
import Sidebar from '../components/Sidebar'; // Import Sidebar component
import Header from '../components/OwnerHeader'; // Import Header component
import RestaurantCard from '../components/RestaurantCard'; // Import RestaurantCard component
import AddRestaurantForm from '../components/AddRestaurantForm'; // Import AddRestaurantForm component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShop } from '@fortawesome/free-solid-svg-icons'
// import { FaShop } from 'react-icons/fa'

const OwnerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility
  const [isAddFormOpen, setIsAddFormOpen] = useState(false); // State to manage add restaurant form visibility

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

        {/* Add Restaurant Button */}
        <button 
          onClick={() => setIsAddFormOpen(true)} 
          className="bg-blue-500 text-white rounded-md px-4 py-2 mb-6 hover:bg-blue-600"
        >
          <FontAwesomeIcon icon={faShop} /> Add Restaurant
        </button>

        {/* Restaurant Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="w-full h-[320px] ">
              <RestaurantCard {...restaurant} isOwner={true} />
            </div>
          ))}
        </div>

         {/* Add Restaurant Form Modal */}
         {isAddFormOpen && (
          <AddRestaurantForm onClose={() => setIsAddFormOpen(false)} />
        )}
        
      </main>
    </>
  );
};

export default OwnerDashboard;