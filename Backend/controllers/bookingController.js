const Booking = require('../model/bookingModel');
const Restaurant = require('../model/restaurantmodel');

const createBooking = async (req, res) => {
    try {
        const { restaurantId, name, mobileNumber, numberOfGuests, visitingDate, email, visitingTime } = req.body;

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        const today = new Date();
        const bookingDate = new Date(visitingDate);
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 7);

        if (bookingDate < today || bookingDate > maxDate) {
            return res.status(400).json({ error: 'Booking date must be within the next 7 days' });
        }

        const booking = new Booking({
            userId: req.user._id,
            restaurantId,
            name,
            mobileNumber,
            numberOfGuests,
            visitingDate,
            email,
            visitingTime
        });

        await booking.save();
        res.status(201).json({ 
            message: 'Booking created successfully', 
            booking 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('restaurantId', 'name location image')
            .sort({ createdAt: -1 });

        res.status(200).json({ bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getRestaurantBookings = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        
        const restaurant = await Restaurant.findOne({
            _id: restaurantId,
            ownerId: req.user._id
        });

        if (!restaurant) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        const bookings = await Booking.find({ restaurantId })
            .populate('userId', 'name email')
            .sort({ visitingDate: 1 });

        res.status(200).json({ bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const restaurant = await Restaurant.findOne({
            _id: booking.restaurantId,
            ownerId: req.user._id
        });

        if (!restaurant) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({ 
            message: 'Booking status updated successfully', 
            booking 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    getRestaurantBookings,
    updateBookingStatus
};