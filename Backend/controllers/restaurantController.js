const restaurant = require('../model/restaurantmodel');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const addRestaurant = async (req, res) => {
    try {
        const { name, location, capacity, cuisines, openingTime, closingTime, phoneNumber } = req.body;
        if (!req.files.image || !req.files.menuImage) {
            return res.status(400).json({ error: 'Images are required' });
        }

        const newRestaurant = new restaurant({
            ownerId: req.user._id,
            image: req.files.image.map(file => file.filename),
            menuImage: req.files.menuImage.map(file => file.filename),
            name,
            location,
            capacity: JSON.parse(capacity),
            cuisines: cuisines.split(','),
            openingTime,
            closingTime,
            phoneNumber
        });
        await newRestaurant.save();
        res.status(201).json({ message: 'Restaurant added successfully', restaurant: newRestaurant });

    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Failed to add restaurant' });
    }
}

const allRestaurant = async (req, res) => {
    try {
        const ownerId = req.user._id;
        const restaurantData = await restaurant.find({ ownerId: ownerId });
        const transformedData = restaurantData.map(restaurant => ({
            ...restaurant.toObject(),
            image: restaurant.image[0]
        }));
        res.status(201).json({ restaurantData: transformedData });
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: error.message })
    }
}

const GetRestaurantById = async (req, res) => {
    try {
        const id = req.params.id;
        const ownerId = req.user._id;
        const Restaurant = await restaurant.findById(id);
        if (!Restaurant) {
            return res.status(404).json({ message: "Restaurant Not Found" });
        }
        res.status(200).json({ restaurantData: Restaurant });
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: error.message })
    }
}

const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, capacity, cuisines, openingTime, closingTime, phoneNumber } = req.body;

        const Restaurant = await restaurant.findOne({ _id: id, ownerId: req.user._id });
        if (!Restaurant) {
            return res.status(404).json({ message: 'Restaurant not found or unauthorized access' });
        }
        if (name) Restaurant.name = name;
        if (location) Restaurant.location = location;
        if (capacity) Restaurant.capacity = JSON.parse(capacity);
        if (cuisines) Restaurant.cuisines = cuisines.split(',');
        if (openingTime) Restaurant.openingTime = openingTime;
        if (closingTime) Restaurant.closingTime = closingTime;
        if (phoneNumber) Restaurant.phoneNumber = phoneNumber;
        if (req.files.image) {
            Restaurant.image = req.files.image.map(file => file.filename);
        }

        if (req.files.menuImage) {
            Restaurant.menuImage = req.files.menuImage.map(file => file.filename);
        }
        await Restaurant.save();
        res.status(200).json({ message: 'Restaurant updated successfully', restaurant: Restaurant });
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: error.message });
    }
}

let gfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads' 
    });
});

const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const Restaurant = await restaurant.findOne({ _id: id, ownerId: req.user._id });
        if (!Restaurant) {
            return res.status(404).json({ message: 'Restaurant not found or unauthorized access' });
        }

        // Delete images from GridFS
        const deleteImageByFilename = async (filename) => {
            try {
                const file = await gfsBucket.find({ filename }).toArray();
                if (file.length > 0) {
                    await gfsBucket.delete(file[0]._id);
                } else {
                    console.warn(`File not found for filename: ${filename}`);
                }
            } catch (error) {
                console.error(`Failed to delete image: ${error.message}`);
            }
        };

        if (Restaurant.image) {
            for (const filename of Restaurant.image) {
                await deleteImageByFilename(filename);
            }
        }
        if (Restaurant.menuImage) {
            for (const filename of Restaurant.menuImage) {
                await deleteImageByFilename(filename);
            }
        }

        // Delete the restaurant document
        await Restaurant.deleteOne();
        res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Failed to delete restaurant', error: error.message });
    }
}

const searchRestaurant = async (req, res) => {
    try {
        const { name } = req.query;
        const ownerId = req.user._id;

        let query = { ownerId };

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        const restaurants = await restaurant.find(query);
        const transformedData = restaurants.map(restaurant => ({
            ...restaurant.toObject(),
            image: restaurant.image[0] // Only the first image
        }));
        res.status(200).json({ message: 'Search results', restaurants: transformedData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to search restaurants', error: error.message });
    }
}

const allRestaurantForCustomer = async (req, res) => {
    try {
        // const userId = req.user._id;
        // console.log(userId);
        // if(!userId){
        //     return res.status(401).json({ message: 'Unauthorized access' });
        // }
        const restaurants = await restaurant.find();
        res.status(200).json({ restaurants });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch restaurants', error: error.message });
    }
}

const addReview = async (req, res) => {
    try {
        const { restaurantId, rating, comment } = req.body;
        const userId = req.user._id;

        const Restaurant = await restaurant.findById(restaurantId);
        if (!Restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Find the index of existing review
        const existingReviewIndex = Restaurant.reviews.findIndex(
            review => review.userId.toString() === userId.toString()
        );

        if (existingReviewIndex !== -1) {
            // Update existing review
            Restaurant.reviews[existingReviewIndex] = {
                userId,
                rating,
                comment,
                date: new Date()
            };
        } else {
            // Add new review
            Restaurant.reviews.push({
                userId,
                rating,
                comment,
                date: new Date()
            });
        }

        // Update average rating
        Restaurant.updateAverageRating();
        await Restaurant.save();

        res.status(200).json({ 
            message: existingReviewIndex !== -1 ? 'Review updated successfully' : 'Review added successfully', 
            restaurant: Restaurant 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add review', error: error.message });
    }
};

module.exports = { addRestaurant, allRestaurant, updateRestaurant, deleteRestaurant, searchRestaurant, GetRestaurantById, allRestaurantForCustomer, addReview };