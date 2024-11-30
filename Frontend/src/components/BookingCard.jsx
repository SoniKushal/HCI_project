import React, { useState } from 'react';

const BookingCard = ({ booking, onCancel }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Booking Card */}
      <div
        className="border p-4 bg-white rounded-md shadow-md transition-transform ease-in-out hover:scale-105 min-h-[150px] relative cursor-pointer"
        onClick={handleCardClick} // Open modal on card click
      >
        <button
          className="absolute top-2 right-2 text-red-500"
          onClick={(e) => {
            e.stopPropagation(); // Prevent modal opening
            onCancel(); // Trigger parent cancel function
          }}
        >
          Cancel
        </button>
        <p>
          <strong className="text-sm">Book ID:</strong> {booking.id}
        </p>
        <p>
          <strong className="text-sm">Book Date:</strong> {booking.date}
        </p>
        <p>
          <strong className="text-sm">Book Time:</strong> {booking.bookingTime}
        </p>
        <p>
          <strong className="text-sm">Tables:</strong> {booking.tables}
        </p>
        <p>
          <strong className="text-sm">Total Guests:</strong> {booking.totalGuests}
        </p>
      </div>

      {/* Modal View */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-6 w-11/12 max-w-md relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className='flex flex-row justify-between mb-4'>
              <h2 className="text-xl font-bold">Booking Details</h2>
              <button
                className="text-lg font-semibold right-2 ml-4 md:ml-20 text-gray-600 hover:scale-110 hover:delay-100 hover:text-red-600"
                onClick={closeModal}
              >
                X
              </button>
              
            </div>
            
            <p>
              <strong className="text-sm">Book ID:</strong> {booking.id}
            </p>
            <p>
              <strong className="text-sm">Book Date:</strong> {booking.date}
            </p>
            <p>
              <strong className="text-sm">Book Time:</strong> {booking.bookingTime}
            </p>
            <p>
              <strong className="text-sm">Tables:</strong> {booking.tables}
            </p>
            <p>
              <strong className="text-sm">Total Guests:</strong> {booking.totalGuests}
            </p>
            <p>
              <strong className="text-sm">Customer Name:</strong> {booking.customerName}
            </p>
            <p>
              <strong className="text-sm">Phone Number:</strong> {booking.customerPhone}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingCard;
