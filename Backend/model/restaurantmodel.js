const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    image: { type: [String], required: true },
    menuImage: { type: [String], required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: {
        "twoPerson": { type: Number, default: 0 },
        "fourPerson": { type: Number, default: 0 },
        "sixPerson": { type: Number, default: 0 }
    },
    cuisines: { type: [String], required: true },
    openingTime: { type: String, required: true },
    closingTime: { type: String, required: true },
    phoneNumber: { type: String, required: true }
});

const restaurant = new mongoose.model('restaurant', restaurantSchema);
module.exports = restaurant
