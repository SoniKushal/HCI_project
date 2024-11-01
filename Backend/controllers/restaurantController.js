const restaurant = require('../model/restaurantmodel');



const addRestaurant = async(req,res)=>{
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

const allRestaurant = async (req,res) =>{
    try {
        const ownerId= req.user._id;
        const restaurantData = await restaurant.find({ownerId:ownerId});
        const transformedData = restaurantData.map(restaurant => ({
            ...restaurant.toObject(),
            image: restaurant.image[0] // Only the first image
        }));
        res.status(201).json({restaurantData:transformedData});
    } catch (error) {
        console.log(error);
        res.status(401).json({error:error.message})
    }
}

const updateRestaurant = async(req,res)=>{
    try {
        const { id } = req.params;
        const { name, location, capacity, cuisines, openingTime, closingTime, phoneNumber } = req.body;

        const restaurant = await restaurant.findOne({ _id: id, ownerId: req.user._id});
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found or unauthorized access' });
        }
        if (name) restaurant.name = name;
        if (location) restaurant.location = location;
        if (capacity) restaurant.capacity = capacity;
        if (cuisines) restaurant.cuisines = cuisines; 
        if (openingTime) restaurant.openingTime = openingTime;
        if (closingTime) restaurant.closingTime = closingTime;
        if (phoneNumber) restaurant.phoneNumber = phoneNumber;
        if (req.files.image) {
            restaurant.image = req.files.image[0].path;
        }
        if (req.files.menuImage) {
            restaurant.menuImage = req.files.menuImage[0].path;
        }
        await restaurant.save();
        res.status(200).json({ message: 'Restaurant updated successfully', restaurant });
    } catch (error) {
        console.log(error);
        res.status(401).json({error:error.message});
    }
}

const deleteRestaurant = async(req,res)=>{
    try {
        const { id } = req.params;
        const restaurant = await restaurant.findOne({ _id: id, ownerId: req.user._id });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found or unauthorized access' });
        }
        if (restaurant.image) {
            fs.unlink(restaurant.image, (err) => {
                if (err) console.error(`Failed to delete image file: ${err.message}`);
            });
        }
        if (restaurant.menuImage) {
            fs.unlink(restaurant.menuImage, (err) => {
                if (err) console.error(`Failed to delete menu image file: ${err.message}`);
            });
        }
        await restaurant.remove();
        res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Failed to delete restaurant', error: error.message });
    }
}

const searchRestaurant = async (req,res)=>{
    try {
        const { name} = req.query;
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

module.exports= {addRestaurant, allRestaurant , updateRestaurant, deleteRestaurant ,searchRestaurant};