import React from 'react';

const bookings = [
    // Example data, replace with real data
    { id: '1', name: 'John Doe', phone: '1234567890', bookingTime: '12:00', arrivalTime: '12:30', tables: '2x2p, 1x4p', totalPeople: 8 },
    // Add more booking objects here
  ];

const BookingCard = ({ booking }) => {
    return (
    <div className="border p-2 bg-white rounded-md shadow-md transition-ease-in-out hover:scale-110 ">
      <p><strong className='text-sm'>Booking ID:</strong> {booking.id}</p>
      <p className='block md:hidden'><strong className='text-sm mt-2 '>Arrival Time:</strong> {booking.arrivalTime}</p>
      <div className='hidden md:block'>
        <p><strong className='text-sm'>Book Time:</strong> {booking.bookingTime}</p>
        <p><strong className='text-sm'>Arrival Time:</strong> {booking.arrivalTime}</p>
        <p><strong className='text-sm'>Tables:</strong> {booking.tables}</p>
      </div>
    </div>

  );
};
export default BookingCard;