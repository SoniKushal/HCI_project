import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa'; // Close icon for popup

const LocationPopup = ({ setSelectedLocation, closePopup }) => {
  const [search, setSearch] = useState('');

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 
    'Chennai', 'Kolkata', 'Pune', 'Jaipur'
  ];

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        closePopup();
      }
    };
    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [closePopup]);

  return (
    <div 
      id="location-popup" 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-white w-1/2 p-6 rounded-lg relative">
        {/* Close Button */}
        <button
          onClick={closePopup}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold mb-4">Choose Location</h2>

        <input
          type="text"
          placeholder="Search cities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 w-full mb-4"
        />

        <div className="grid grid-cols-3 gap-4">
          {cities
            .filter((city) => city.toLowerCase().includes(search.toLowerCase()))
            .map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSelectedLocation(city);
                  closePopup();
                }}
                className="bg-gray-200 p-2 rounded hover:bg-gray-300"
              >
                {city}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LocationPopup;
