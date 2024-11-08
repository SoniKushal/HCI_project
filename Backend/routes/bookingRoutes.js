const express = require('express');
const router = express.Router();
const validatetoken = require('../middleware/validatetoken');
const bookingController = require('../controllers/bookingController');

// Create a new booking
router.post('/create', validatetoken, bookingController.createBooking);

// Get user's bookings
router.get('/user-bookings', validatetoken, bookingController.getUserBookings);

// Get restaurant's bookings (for restaurant owners)
router.get('/restaurant-bookings/:restaurantId', validatetoken, bookingController.getRestaurantBookings);

// Update booking status (for restaurant owners)
router.patch('/update-status/:bookingId', validatetoken, bookingController.updateBookingStatus);

module.exports = router;