const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Enter name"]
    },
    email: {
        type: String,
        required: [true, "Enter email"],
        validate: {
            validator: function (v) {
                return validator.isEmail(v); 
            },
            message: "Enter a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "Enter password"],
        validate: {
            validator: function (v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(v);
            },
            message: "Password must be of minimum length 6 and must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        }
    },
    phone: { // New phone field
        type: String,
        required: [true, "Enter phone number"], // Make it required if necessary
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); // Validates if the phone number is 10 digits
            },
            message: "Phone number must be 10 digits long"
        }
    },
    isOwner: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const user = new mongoose.model('user', userSchema);
module.exports = user;
