require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passportsetup = require('./middleware/passport_setup');
const passport = require('passport');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');

const app = express();
const uri = process.env.MONGO_URI;

const port = process.env.port || 4000;
const restaurantRoutes = require('./routes/restaurantRoutes');

app.use(cors({
    origin: 'http://localhost:5173', // Adjust based on your frontend's URL
    credentials: true,
}));

app.use(express.json()); // Parse JSON bodies
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/auth',userRoutes)
app.use('/restaurant', restaurantRoutes);

mongoose.connect(uri)
    .then(() => {
        console.log("Connected to Database");
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch(err => console.log(err));

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).json({ message: 'Something went wrong!' });
});