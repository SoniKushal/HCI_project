import React, { useState, useEffect, useRef } from 'react';
import immm from "../assets/italian.jpg";
import Header from '../components/Header';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Reservation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const existingReservation = location.state?.existingReservation;
  const [restaurant, setRestaurant] = useState(null);
  const [availableSlots, setAvailableSlots] = useState(null);
  const [activeTab, setActiveTab] = useState('offers');
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [currentTime, setCurrentTime] = useState("");
  const [closingTime] = useState("22:00"); // Example: 10 PM, replace with actual restaurant closing time
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capacity, setCapacity] = useState({ twoPerson: 0, fourPerson: 0, sixPerson: 0 });
  const capacityModalRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialRequest: '',
  });
  const token = localStorage.getItem('token');
  useEffect(() => {
    const today = new Date();
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);

    setMinDate(today.toISOString().split('T')[0]);
    setMaxDate(sevenDaysLater.toISOString().split('T')[0]);
    // Calculate current time + 1 hour
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Format current time + 1 hour
    const minHours = hours.toString().padStart(2, "0");
    const minMinutes = minutes.toString().padStart(2, "0");
    const minTimeFormatted = `${minHours}:${minMinutes}`;

    // Set the current time to be used in the input field
    setCurrentTime(minTimeFormatted);
    
  }, []);

  // Fetch restaurant details
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/restaurant/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRestaurant(response.data);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      }
    };
    fetchRestaurant();
  }, [id]);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  // State for the Check Availability modal
  const [isCheckAvailabilityModalOpen, setIsCheckAvailabilityModalOpen] = useState(false);

  // Handlers for Check Availability Modal
  const openCheckAvailabilityModal = () => {
    setIsCheckAvailabilityModalOpen(true);
  };

  const closeCheckAvailabilityModal = () => {
    setIsCheckAvailabilityModalOpen(false);
  };

  // Function to handle time slot selection
  const [availableTablesForSelectedTime, setAvailableTablesForSelectedTime] = useState(null);

  const handleTimeSlotSelection = (time, tables) => {
    setSelectedTime(time);
    setAvailableTablesForSelectedTime(tables);
    setIsCheckAvailabilityModalOpen(false);
    setCapacity({ twoPerson: 0, fourPerson: 0, sixPerson: 0 });
    setShowBookingForm(true);
  };
  
  console.log(selectedDate, selectedTime);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Check availability
  console.log(token);
  const checkAvailability = async () => {
    try {
      const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
      
      if (!isTimeValid(selectedDateTime)) {
        alert('Booking must be made at least 60 minutes in advance');
        return;
      }

      const response = await axios.post(
        'http://localhost:4000/reservation/checkAvailability', 
        {
          restaurantId: id,
          date: selectedDate,
          time: selectedTime,
          reservationId: existingReservation?._id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setAvailableSlots(response.data.availability);
      setShowBookingForm(false);
      openCheckAvailabilityModal();
    } catch (error) {
      console.error('Error checking availability:', error);
      alert(error.response?.data?.message || 'Error checking availability');
    }
  };

  // Handle booking
  const handleBooking = async (e) => {
    e.preventDefault();
    
    // Add validation for minimum table selection
    const totalTables = capacity.twoPerson + capacity.fourPerson + capacity.sixPerson;
    if (totalTables === 0) {
      alert('Please select at least one table');
      return;
    }

    try {
      if (existingReservation) {
        await axios.put(
          `http://localhost:4000/reservation/updateReservation/${existingReservation._id}`,
          {
            updates: {
              date: selectedDate,
              time: selectedTime,
              tables: capacity,
              specialRequest: formData.specialRequest
            }
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        await axios.post(
          'http://localhost:4000/reservation/createReservation',
          {
            restaurantId: id,
            date: selectedDate,
            time: selectedTime,
            tables: capacity,
            specialRequest: formData.specialRequest
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }
      
      alert(existingReservation ? 'Reservation updated successfully!' : 'Booking successful!');
      navigate('/bookings');
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Error processing reservation');
    }
  };

  const handleOutsideClick = (e) => {
    if (
      capacityModalRef.current &&
      !capacityModalRef.current.contains(e.target)
    ) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModalOpen]);

  const handleAddCapacity = (type, delta) => {
    if (!availableTablesForSelectedTime) return;
    
    const newValue = Math.max(0, capacity[type] + delta);
    if (delta > 0 && newValue > availableTablesForSelectedTime[type]) {
      alert(`Only ${availableTablesForSelectedTime[type]} ${type} tables available`);
      return;
    }
    
    setCapacity((prev) => ({
      ...prev,
      [type]: newValue,
    }));
  };

  console.log("curretTime", currentTime);
  console.log("closingTime", closingTime);

  // Add new state to control booking form visibility
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Add function to check if selected time is at least 60 mins ahead
  const isTimeValid = (selectedDateTime) => {
    const now = new Date();
    const selected = new Date(selectedDateTime);
    const diffInMinutes = (selected - now) / (1000 * 60);
    return diffInMinutes >= 60;
  };

  useEffect(() => {
    if (existingReservation) {
      setSelectedDate(new Date(existingReservation.date).toISOString().split('T')[0]);
      setSelectedTime(existingReservation.time);
      setCapacity(existingReservation.tables);
      setFormData(prev => ({
        ...prev,
        specialRequest: existingReservation.specialRequest || ''
      }));
      setShowBookingForm(true);
      setAvailableTablesForSelectedTime(existingReservation.tables);
    }
  }, [existingReservation]);

  return (
    <>
      <Header />
      {console.log(restaurant)};
      {restaurant && (
        <div className="flex flex-col min-h-screen">
          <div className="relative">
            <div className="relative h-[400px] w-full">
              <img
                src={`http://localhost:4000/restaurant/images/${restaurant.restaurantData.image[0]}`}
                alt={restaurant.restaurantData.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <div className="max-w-6xl mx-auto">
                  <h1 className="text-3xl font-bold text-white mb-2">{restaurant.restaurantData.name}</h1>
                  <div className="flex items-center gap-4 text-white">
                    <div>{restaurant.restaurantData.location}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 px-4 py-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr,400px] gap-6">
              {/* Main Content */}
              <div>
                <div className="border-b mb-6">
                  <ul className="flex gap-4">
                    {['offers', 'menu', 'photos', 'about'].map((tab) => (
                      <li key={tab}>
                        <a
                          href={`#${tab}`}
                          className={`pb-2 px-1 inline-block ${activeTab === tab ? 'border-b-2 border-orange-500' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab(tab);
                          }}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              
              {activeTab === 'offers' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Sample Bill (Approx Discount)</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Bill</span>
                      <span>₹1200</span>
                    </div>
                    <div className="flex justify-between text-orange-500">
                      <span>EazyDiner Discount</span>
                      <span>-₹435</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>You Paid</span>
                      <span>₹765</span>
                    </div>
                    <a href="#" className="text-blue-500">Calculate Your Exact Discount</a>
                  </div>
                </div>
              )}

              {activeTab === 'menu' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {restaurant.restaurantData.menuImage.map((menuImg, index) => (
                    <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
                      <img
                        src={`http://localhost:4000/restaurant/images/${menuImg}`}
                        alt={`Menu page ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'photos' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {restaurant.restaurantData.image.map((photo, index) => (
                    <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
                      <img
                        src={`http://localhost:4000/restaurant/images/${photo}`}
                        alt={`Restaurant photo ${index + 1}`}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'about' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">About {restaurant.restaurantData.name}</h3>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      <span className="font-medium">Location:</span> {restaurant.restaurantData.location}
                    </p>
                    <p>
                      <span className="font-medium">Cuisines:</span> {restaurant.restaurantData.cuisines.join(', ')}
                    </p>
                    <p>
                      <span className="font-medium">Opening Hours:</span> {restaurant.restaurantData.openingTime} - {restaurant.restaurantData.closingTime}
                    </p>
                    <p>
                      <span className="font-medium">Contact:</span> {restaurant.restaurantData.phoneNumber}
                    </p>
                    <p>
                      <span className="font-medium">Seating Capacity:</span>
                      <ul className="list-disc ml-5 mt-2">
                        <li>Two Person Tables: {restaurant.restaurantData.capacity.twoPerson}</li>
                        <li>Four Person Tables: {restaurant.restaurantData.capacity.fourPerson}</li>
                        <li>Six Person Tables: {restaurant.restaurantData.capacity.sixPerson}</li>
                      </ul>
                    </p>
                  </div>
                </div>
              )}
            </div>

              {/* Booking Form */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Reserve Table</h3>
                    <form onSubmit={handleBooking} className="space-y-4">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Visiting Date</label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          min={minDate}
                          max={maxDate}
                          value={selectedDate}
                          onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setShowBookingForm(false);
                          }}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                          required
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex-1">
                          <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                          <input
                            type="time"
                            id="time"
                            name="time"
                            value={selectedTime}
                            onChange={(e) => {
                              setSelectedTime(e.target.value);
                              setShowBookingForm(false);
                            }}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (!selectedDate || !selectedTime) {
                                alert('Please select both date and time');
                                return;
                              }
                              checkAvailability();
                            }}
                            className="mt-7 w-full px-3 py-2 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600"
                          >
                            Check Availability
                          </button>
                        </div>
                      </div>

                      {/* Check Availability Modal */}
                      {selectedDate && selectedTime && isCheckAvailabilityModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full relative">
                            <h2 className="text-lg font-semibold mb-4">Available Time Slots</h2>
                            {availableSlots && (
                              <div className="flex gap-4 justify-between">
                                {/* Before Slot */}
                                <div className="flex-1 p-4 border rounded-lg hover:border-red-500 transition-all">
                                  <p className="font-semibold text-center">Earlier Slot</p>
                                  <p className="text-center text-lg font-bold">{availableSlots.beforeSlot.time}</p>
                                  <div className="space-y-2 mt-4">
                                    <p>Two Person Tables: {availableSlots.beforeSlot.tables.twoPerson} available</p>
                                    <p>Four Person Tables: {availableSlots.beforeSlot.tables.fourPerson} available</p>
                                    <p>Six Person Tables: {availableSlots.beforeSlot.tables.sixPerson} available</p>
                                  </div>
                                  <div className="text-center mt-4">
                                    <button
                                      onClick={() => handleTimeSlotSelection(availableSlots.beforeSlot.time, availableSlots.beforeSlot.tables)}
                                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full"
                                    >
                                      Select
                                    </button>
                                  </div>
                                </div>

                                {/* Current Slot */}
                                <div className="flex-1 p-4 border rounded-lg bg-gray-50 hover:border-red-500 transition-all">
                                  <p className="font-semibold text-center">Selected Time Slot</p>
                                  <p className="text-center text-lg font-bold">{availableSlots.currentSlot.time}</p>
                                  <div className="space-y-2 mt-4">
                                    <p>Two Person Tables: {availableSlots.currentSlot.tables.twoPerson} available</p>
                                    <p>Four Person Tables: {availableSlots.currentSlot.tables.fourPerson} available</p>
                                    <p>Six Person Tables: {availableSlots.currentSlot.tables.sixPerson} available</p>
                                  </div>
                                  <div className="text-center mt-4">
                                    <button
                                      onClick={() => handleTimeSlotSelection(availableSlots.currentSlot.time, availableSlots.currentSlot.tables)}
                                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full"
                                    >
                                      Select
                                    </button>
                                  </div>
                                </div>

                                {/* After Slot */}
                                <div className="flex-1 p-4 border rounded-lg hover:border-red-500 transition-all">
                                  <p className="font-semibold text-center">Later Slot</p>
                                  <p className="text-center text-lg font-bold">{availableSlots.afterSlot.time}</p>
                                  <div className="space-y-2 mt-4">
                                    <p>Two Person Tables: {availableSlots.afterSlot.tables.twoPerson} available</p>
                                    <p>Four Person Tables: {availableSlots.afterSlot.tables.fourPerson} available</p>
                                    <p>Six Person Tables: {availableSlots.afterSlot.tables.sixPerson} available</p>
                                  </div>
                                  <div className="text-center mt-4">
                                    <button
                                      onClick={() => handleTimeSlotSelection(availableSlots.afterSlot.time, availableSlots.afterSlot.tables)}
                                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full"
                                    >
                                      Select
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            <button
                              onClick={closeCheckAvailabilityModal}
                              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Only show booking form after time slot is selected */}
                      {showBookingForm && (
                        <>
                          {/* Table Selection */}
                          {selectedDate && selectedTime && availableTablesForSelectedTime && (
                            <div>
                              <h4 className="text-sm font-medium">Book Table</h4>
                              <div className="space-y-4 mt-2">
                                {[
                                  { key: 'twoPerson', label: 'Two Person' },
                                  { key: 'fourPerson', label: 'Four Person' },
                                  { key: 'sixPerson', label: 'Six Person' }
                                ].map(({ key, label }) => (
                                  <div key={key} className="flex justify-between items-center">
                                    <span>{label} ({availableTablesForSelectedTime[key]} available)</span>
                                    <div className="flex items-center">
                                      <button
                                        type="button"
                                        className="px-2 border hover:bg-red-300"
                                        onClick={() => handleAddCapacity(key, -1)}
                                      >
                                        −
                                      </button>
                                      <span className="mx-2">{capacity[key]}</span>
                                      <button
                                        type="button"
                                        className="px-2 border hover:bg-green-300"
                                        onClick={() => handleAddCapacity(key, 1)}
                                        disabled={capacity[key] >= availableTablesForSelectedTime[key]}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Personal Details Form */}
                          <div>
                            <label htmlFor="specialRequest" className="block text-sm font-medium text-gray-700">Special Request</label>
                            <textarea
                              id="specialRequest"
                              name="specialRequest"
                              placeholder='optional'
                              value={formData.specialRequest}
                              onChange={handleInputChange}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            />
                          </div>
                          <div className='flex justify-center'>
                            <button
                              type="submit"
                              className="w-half mt-4 px-4 py-2 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600"
                            >
                              Book Now
                            </button>
                          </div>
                        </>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
