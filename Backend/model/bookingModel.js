const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant',
        required: true
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    mobileNumber: {
        type: String,
        required: [true, "Mobile number is required"],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: "Please enter a valid 10-digit mobile number"
        }
    },
    numberOfGuests: {
        type: Number,
        required: [true, "Number of guests is required"],
        min: [1, "At least one guest is required"]
    },
    visitingDate: {
        type: Date,
        required: [true, "Visiting date is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: function(v) {
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
            },
            message: "Please enter a valid email address"
        }
    },
    visitingTime: {
        type: String,
        required: [true, "Visiting time is required"]
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;