import React, { useState, useEffect } from 'react';
import Header from '../components/OwnerHeader';
import Sidebar from '../components/Sidebar';
import { FaCalendar, FaClock,FaUser, FaUsers, FaTicketAlt, FaPhoneAlt , FaSort, FaFilter } from 'react-icons/fa';

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility
  const [restaurants, setRestaurants] = useState([]); // List of owner’s restaurants
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // "asc" or "desc"
  const [statusFilter, setStatusFilter] = useState(''); // "completed" or "cancelled"
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    // Static data for demonstration
    const staticRestaurants = [
      { _id: '1', name: 'The Gourmet Kitchen' },
      { _id: '2', name: 'Urban Spice Diner' },
      { _id: '3', name: 'Seafood Delights' },
    ];

    const staticBookings = [
        {
          _id: '101',
          restaurant: { name: 'The Gourmet Kitchen' },
          customer: { name: 'John Doe', phone: '1234567890' },
          date: '2024-12-01',
          time: '19:00',
          tables: {
            '2p': 5,
            '4p': 2,
            '6p': 1,
            total: 8,
          },
          status: 'completed',
        },
        {
          _id: '102',
          restaurant: { name: 'Urban Spice Diner' },
          customer: { name: 'Jane Smith', phone: '0987654321' },
          date: '2024-12-02',
          time: '20:30',
          tables: {
            '2p': 3,
            '4p': 4,
            '6p': 0,
            total: 7,
          },
          status: 'cancelled',
        },
        {
          _id: '103',
          restaurant: { name: 'Seafood Delights' },
          customer: { name: 'Alice Brown', phone: '1122334455' },
          date: '2024-12-03',
          time: '18:15',
          tables: {
            '2p': 2,
            '4p': 1,
            '6p': 2,
            total: 5,
          },
          status: 'completed',
        },
        {
          _id: '104',
          restaurant: { name: 'The Gourmet Kitchen' },
          customer: { name: 'Bob Green', phone: '9988776655' },
          date: '2024-12-04',
          time: '21:00',
          tables: {
            '2p': 6,
            '4p': 3,
            '6p': 2,
            total: 11,
          },
          status: 'cancelled',
        },
        {
          _id: '105',
          restaurant: { name: 'Urban Spice Diner' },
          customer: { name: 'Charlie White', phone: '3344556677' },
          date: '2024-12-05',
          time: '19:45',
          tables: {
            '2p': 4,
            '4p': 2,
            '6p': 1,
            total: 7,
          },
          status: 'completed',
        },
      ];
    
      setRestaurants(staticRestaurants);
      setBookings(staticBookings);
    }, []);

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
    let updatedBookings = [...bookings];

    // Filter by restaurant
    if (selectedRestaurant) {
      updatedBookings = updatedBookings.filter(
        (booking) => booking.restaurant.name === selectedRestaurant
      );
    }

    // Filter by status
    if (statusFilter) {
      updatedBookings = updatedBookings.filter(
        (booking) => booking.status === statusFilter
      );
    }

    // Sort by date
    updatedBookings.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredBookings(updatedBookings);
  }, [bookings, selectedRestaurant, sortOrder, statusFilter]);

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <div className={`fixed top-0 z-50 left-0 w-64 h-screen bg-white p-4 transition-transform duration-300 ${!isSidebarOpen ? "block" : "hidden"} `}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="p-4 bg-gray-100 lg:ml-64 transition-all duration-300">
        <h1 className="text-3xl font-bold mb-8">Booking History</h1>

          {/* Filters and Sort */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Filter by Restaurant</label>
                <select
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                  className="border rounded p-2 w-32"
                >
                  <option value="">All</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant._id} value={restaurant.name}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
              </div>
              
                <div>
                    <label className="block text-sm font-medium mb-1">Filter by Status</label>
                    <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded p-2 w-full"
                    >
                    <option value="">All</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium mb-1">Sort by Date</label>
                <div className="flex gap-2">
                    <button
                    onClick={() => setSortOrder('asc')}
                    className={`px-2 py-2 border rounded ${
                        sortOrder === 'asc' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                    >
                    Oldest
                    </button>
                    <button
                    onClick={() => setSortOrder('desc')}
                    className={`px-2 py-2 border rounded ${
                        sortOrder === 'desc' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                    >
                    Latest
                    </button>
                </div>
            </div>
          </div>

          {/* Bookings */}
          <div className="grid gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <div className='flex flex-row justify-between'>
                    <h2 className="text-xl font-semibold mb-2">
                      {booking.restaurant.name}
                    </h2>
                    <div className="flex flex-col items-end space-y-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        booking.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <FaTicketAlt className="mr-2" />
                        <span className="font-medium">Booking ID:</span>
                        <span className="ml-2">{booking._id}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaUser className="mr-2" />
                        <span className="font-medium">Customer Name:</span>
                        <span className="ml-2">{booking.customer.name}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaPhoneAlt className='mr-2'/>
                        <span className="font-medium">Phone Number:</span>
                        <span className="ml-2">{booking.customer.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaCalendar className="mr-2" />
                        <span className='font-medium'>Date:</span>
                        <span className="ml-2">{new Date(booking.date).toLocaleDateString()} </span>
                        <FaClock className="ml-4 mr-2" />
                        <span className='font-medium'>Time:</span>
                        <span className="ml-2">{booking.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                      <img src="src/assets/dining-table.png " alt="table" className="w-5 h-5 mr-2 opacity-70" />
                        <span className="font-medium">Tables:</span>
                        <span className="ml-2">
                          2 person: {booking.tables['2p']}, 4 person: {booking.tables['4p']}, 6 person: {booking.tables['6p']}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                      <FaUsers className="mr-2" /> 
                        <span className="font-medium">Total Guests:</span>
                        <span className="ml-2">
                         {booking.tables.total}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
    </main>
    </>
  );
};

export default OwnerBookings;
