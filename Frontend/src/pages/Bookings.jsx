import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { FaCalendar, FaClock, FaUsers, FaTicketAlt, FaStar, FaEdit, FaTimes } from 'react-icons/fa';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [reviewModal, setReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:4000/reservation/user-reservations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data.reservations);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleCancel = async (reservationId) => {
    try {
      await axios.delete(`http://localhost:4000/reservation/deleteReservation/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings(); // Refresh bookings after cancellation
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert(error.response?.data?.message || 'Error cancelling reservation');
    }
  };

  const handleModify = (booking) => {
    console.log(booking);
    navigate(`/reservations/${booking.restaurantId._id}`, {
      state: { existingReservation: booking }
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:4000/restaurant/review',
        {
          restaurantId: selectedBooking.restaurantId._id,
          rating: review.rating,
          comment: review.comment
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setReviewModal(false);
      setReview({ rating: 5, comment: '' }); // Reset form
      fetchBookings(); // Refresh bookings to show updated data
      alert('Review submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting review');
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div 
              key={booking._id} 
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold mb-2">{booking.restaurant.name}</h2>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <FaCalendar className="mr-2" />
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-2" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaUsers className="mr-2" />
                      <span>
                        Tables: {booking.tables.twoPerson > 0 && `${booking.tables.twoPerson} × 2-seater, `}
                        {booking.tables.fourPerson > 0 && `${booking.tables.fourPerson} × 4-seater, `}
                        {booking.tables.sixPerson > 0 && `${booking.tables.sixPerson} × 6-seater`}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaTicketAlt className="mr-2" />
                      <span>Entry Code: {booking.entryCode}</span>
                    </div>
                    {booking.specialRequest && (
                      <div className="flex items-start text-gray-600">
                        <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>
                          <span className="font-medium">Special Request:</span><br />
                          {booking.specialRequest}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                  
                  <div className="flex flex-col gap-2 mt-2">
                    {booking.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => handleModify(booking)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full flex items-center justify-center gap-2"
                        >
                          <FaEdit /> Modify
                        </button>
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full flex items-center justify-center gap-2"
                        >
                          <FaTimes /> Cancel
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setReview({ rating: 5, comment: '' });
                        setReviewModal(true);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full flex items-center justify-center gap-2"
                    >
                      <FaStar /> Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Updated Review Modal */}
        {reviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-w-[90%]">
              <h2 className="text-xl font-bold mb-4">Review {selectedBooking.restaurant.name}</h2>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-2 mb-2">
                    {[5, 4, 3, 2, 1].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setReview(prev => ({ ...prev, rating: num }))}
                        className={`p-2 rounded-full transition-colors ${
                          review.rating >= num 
                            ? 'text-yellow-400 hover:text-yellow-500' 
                            : 'text-gray-300 hover:text-gray-400'
                        }`}
                      >
                        <FaStar size={24} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Comment</label>
                  <textarea
                    value={review.comment}
                    onChange={(e) => setReview(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full border rounded p-2"
                    rows="3"
                    placeholder="Share your experience..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setReviewModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
                  >
                    <FaStar size={16} />
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Bookings; 