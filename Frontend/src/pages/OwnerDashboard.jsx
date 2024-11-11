import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar'; // Import Sidebar component
import Header from '../components/OwnerHeader'; // Import Header component
import RestaurantCard from '../components/RestaurantCard'; // Import RestaurantCard component
import AddRestaurantForm from '../components/AddRestaurantForm'; // Import AddRestaurantForm component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShop } from '@fortawesome/free-solid-svg-icons'
// import { FaShop } from 'react-icons/fa'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility
  const [isAddFormOpen, setIsAddFormOpen] = useState(false); // State to manage add restaurant form visibility
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (isAddFormOpen) {
  //       document.body.classList.add("modal-open");
  //   } else {
  //       document.body.classList.remove("modal-open");
  //   }
  // } , [isAddFormOpen]);
  useEffect(() => {
    fetchRestaurants();
  }, [])

  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/restaurant/allRestaurant', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const restaurantData = res.data.restaurantData.map(restaurant => ({
        ...restaurant,
        imageUrl: `http://localhost:4000/restaurant/images/${restaurant.image}`// URL for the first image
      }));
      setRestaurants(restaurantData);
      setFilteredRestaurants(restaurantData);
    } catch (err) {
      console.log('Failed to Fetch Restaurants', err);
      if (err.response && err.response.status === 401) {
        // Token has expired, redirect to login page
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }
  // const restaurantData = (newRestaurant) => {
  //   setRestaurants((prevRestaurants) => [...prevRestaurants, newRestaurant]);
  //   setFilteredRestaurants((prevFiltered) => [...prevFiltered, newRestaurant]);
  // }
  const addRestaurant = (newRestaurant) => {
    setRestaurants((prevRestaurants) => [...prevRestaurants, newRestaurant]);
    setFilteredRestaurants((prevFiltered) => [...prevFiltered, newRestaurant]);
  }
  const handleSearch = async (query) =>{
    setSearchQuery(query);
    if(query) {
       try {
         const token = localStorage.getItem('token');
         const res = await axios.get(`http://localhost:4000/restaurant/searchRestaurant?name=${query}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const searchResults = res.data.restaurants.map(restaurant => ({
            ...restaurant,
            imageUrl: `http://localhost:4000/restaurant/images/${restaurant.image}`
        }))
        setFilteredRestaurants(searchResults);
        } catch (err) {
          console.log('Failed to search Restaurants', err);
          if (err.response && err.response.status === 401) {
            // Token has expired, redirect to login page
            localStorage.removeItem('token');
            navigate('/login');
          }
        }
    } else {
      setFilteredRestaurants(restaurants);
    }
  }
  // const handleRestaurantAdded = (newRestaurant) => {
  //   setRestaurants([...restaurants, newRestaurant]); // Add new restaurant to state
  // };
  return (
    <>
      <Header toggleSidebar={toggleSidebar} onSearch={handleSearch}  />

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
          {filteredRestaurants.map((restaurant) => (
            
            <div key={restaurant._id} className="w-full h-[320px] ">
              <RestaurantCard
                name={restaurant.name}
                address={restaurant.location}
                imageUrl={restaurant.imageUrl}
                isOwner = {true}
                restaurantId = {restaurant._id}
              />

            </div>
          ))}
        </div>

        {/* Add Restaurant Form Modal */}
        {isAddFormOpen && (
          <AddRestaurantForm onClose={() => setIsAddFormOpen(false)}  addRestaurant={addRestaurant}/>
        )}

      </main>
    </>
  );
};

export default OwnerDashboard;