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
    phoneNumber: { type: String, required: true },
    reviews: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String },
        date: { type: Date, default: Date.now }
    }],
    averageRating: { type: Number, default: 0 }
});

// Fix the updateAverageRating method
restaurantSchema.methods.updateAverageRating = function() {
    if (this.reviews.length === 0) {
        this.averageRating = 0;
    } else {
        const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
        this.averageRating = Number((sum / this.reviews.length).toFixed(1));
    }
};

const restaurant = new mongoose.model('restaurant', restaurantSchema);
module.exports = restaurant
