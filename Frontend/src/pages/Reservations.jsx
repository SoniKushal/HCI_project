import React, { useState, useEffect, useRef } from 'react';
import immm from "../assets/italian.jpg";
import Header from '../components/Header';

export default function Reservation() {
  const [activeTab, setActiveTab] = useState('offers');
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capacity, setCapacity] = useState({ twoPerson: 0, fourPerson: 0, sixPerson: 0 });
  const capacityModalRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialRequest: '',
  });

  useEffect(() => {
    const today = new Date();
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);

    setMinDate(today.toISOString().split('T')[0]);
    setMaxDate(sevenDaysLater.toISOString().split('T')[0]);
  }, []);


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
  const handleTimeSlotSelection = (time) => {
    setSelectedTime(time);
    setIsCheckAvailabilityModalOpen(false); // Close the modal after selection
  };
  
  console.log(selectedDate, selectedTime);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = (e) => {
    e.preventDefault();
    alert("Booking submitted successfully!");
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
    setCapacity((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen">
        <div className="relative">
          <div className="relative h-[400px] w-full">
            <img
              src={immm}
              alt="Italian restaurant interior"
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">The Italian Bistro</h1>
                <div className="flex items-center gap-4 text-white">
                  <div>Kudasan, Gandhinagar</div>
                  <div>4.0 (1 review)</div>
                  <div>0.63k likes</div>
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
                {[1, 2, 3, 4].map((menu) => (
                  <div key={menu} className="bg-white rounded-lg shadow overflow-hidden">
                    <img
                      src={immm}
                      alt={`Menu page ${menu}`}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'photos' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((photo) => (
                  <div key={photo} className="bg-white rounded-lg shadow overflow-hidden">
                    <img
                      src={immm}
                      alt={`Restaurant photo ${photo}`}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">About The Italian Bistro</h3>
                <p className="text-gray-600">
                  The Italian Bistro offers an authentic Italian dining experience in the heart of Kudasan, Gandhinagar. 
                  Our menu features a wide range of traditional Italian dishes prepared with the freshest ingredients. 
                  Enjoy our cozy atmosphere and excellent service for a memorable dining experience.
                </p>
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
                        onChange={(e) => setSelectedDate(e.target.value)}
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
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                          required
                        />
                      </div>
                      <div className="flex-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (!selectedDate || !selectedTime) {
                                alert('Please input both date and time before checking availability.');
                                return;
                              }
                              openCheckAvailabilityModal();
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
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full relative flex flex-col">
                          <h2 className="text-lg font-semibold mb-4 text-center">Check Availability</h2>
                          <div className="flex justify-between space-x-4">
                          <button
                            type="button"
                            onClick={closeCheckAvailabilityModal}
                            className="absolute text-xl font-semibold top-4 right-4 text-gray-600 hover:scale-110 hover:delay-100 hover:text-red-600"
                          >
                            ✕
                          </button>
                            {(() => {
                              // Base time logic
                              const baseTime = new Date(`${selectedDate}T${selectedTime}`);
                              const minusOneHour = new Date(baseTime.getTime() - 60 * 60 * 1000);
                              const plusOneHour = new Date(baseTime.getTime() + 60 * 60 * 1000);

                              // Formatting times
                              const formatTime = (time) =>
                                time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

                              const timeSlots = [
                                { label: '-1 Hour', time: minusOneHour },
                                { label: 'Selected', time: baseTime },
                                { label: '+1 Hour', time: plusOneHour },
                              ];

                              // Mock availability data
                              const mockAvailability = {
                                '-1 Hour': { '2p': 3, '4p': 2, '6p': 1 },
                                'Selected Time': { '2p': 5, '4p': 3, '6p': 2 },
                                '+1 Hour': { '2p': 2, '4p': 4, '6p': 0 },
                              };

                              return timeSlots.map((slot, index) => {
                                const formattedTime = formatTime(slot.time);
                                const availability = mockAvailability[slot.label] || {};

                                return (
                                  <div
                                    key={index}
                                    className="flex-1 p-4 bg-gray-100 rounded-lg text-center hover:bg-gray-200 cursor-pointer"
                                  >
                                    <p className="text-sm text-gray-500">{slot.label}</p>
                                    <p className="text-lg font-bold">{formattedTime}</p>
                                    <div className="mt-2 text-md text-gray-600">
                                      <p>{`2person Tables: ${availability['2p'] || 0}`}</p>
                                      <p>{`4person Tables: ${availability['4p'] || 0}`}</p>
                                      <p>{`6person Tables: ${availability['6p'] || 0}`}</p>
                                    </div>
                                    <button
                                      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                      onClick={() => {
                                        handleTimeSlotSelection(formattedTime);
                                        closeCheckAvailabilityModal();
                                      }}
                                    >
                                      Select {formattedTime}
                                    </button>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      </div>
                    )}





                    {selectedDate && selectedTime && (
                      <>
                        <div>
                          <h4 className="text-sm font-medium">Book Table</h4>
                          <div className="space-y-4 mt-2">
                            {['twoPerson', 'fourPerson', 'sixPerson'].map((type, idx) => (
                              <div key={idx} className="flex justify-between items-center">
                                <span className="capitalize">{type.replace(/([A-Z])/g, ' $1')}</span>
                                <div className="flex items-center">
                                  <button
                                    type="button"
                                    className="px-2 border hover:bg-red-300"
                                    onClick={() => handleAddCapacity(type, -1)}
                                  >
                                    −
                                  </button>
                                  <span className="mx-2">{capacity[type]}</span>
                                  <button
                                    type="button"
                                    className="px-2  border hover:bg-green-300"
                                    onClick={() => handleAddCapacity(type, 1)}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            required
                          />
                        </div>
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
                      </>
                    )}
                    <div className='flex justify-center'>
                      <button
                        type="submit"
                        className="w-half mt-4 px-4 py-2 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600"
                      >
                        Book Now
                    </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
