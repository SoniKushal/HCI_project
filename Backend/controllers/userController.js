const usermodel = require('../model/usermodel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const bcrypt = require('bcrypt');
const Token = require('../model/tokenmodel');
require('dotenv').config();

const signup_post = async (req, res) => {
    try {
      const { name, phone, email, password, isOwner } = req.body;
  
      const user = await usermodel.findOne({ email });
      if (user) {
        return res.status(409).json({ message: "User already exists" });
      }
  
      const newUser = new usermodel({
        name,
        phone,
        email,
        password, 
        isOwner
      });
  
      await newUser.save();
      res.status(200).json({ message: "User created successfully", userId: newUser._id, owner: newUser.isOwner });
  
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  };
  


const login_post = async (req, res) => {
    try {
        const { email, password, isOwner } = req.body;

        // Retrieve user from DB based on email
        const data = await usermodel.findOne({ email: email });
        if (!data) {
            return res.status(401).json({ message: "Enter valid email" });
        }

        // Ensure the user matches the role (isOwner)
        if (data.isOwner !== isOwner) {
            return res.status(401).json({ message: "Invalid user" });
        }


        const isMatch = await bcrypt.compare(password, data.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Enter valid password" });
        }

        // Generate a JWT token
        const token = jwt.sign({ _id: data._id, isOwner: data.isOwner }, process.env.JWT_SECRET, {
            expiresIn: "24h"
        });

        // Set the token in the Authorization header
        res.setHeader('Authorization', 'Bearer ' + token);

        // Send the response back
        res.status(200).json({
            message: "User logged in successfully",
            userId: data._id,
            token: token
        });
    } catch (error) {
        // Log the error and send a response with a 500 status code
        console.log(error.message);
        res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
    }
};


const sendresetpasswordmail = async (name, email, token) => {
    try {

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            requireTLS: true,
            auth: {
                user: process.env.email,
                pass: process.env.password
            }
        });

        const mailOptions = {
            from: process.env.email,
            to: email,
            subject: 'For reset password',
            html: `<p>Hi, ${name}, please copy the link and <a href="${process.env.FRONTEND_URL}/reset-password/${token}">reset your password</a>.</p>`

        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log(`email send successfully ${info.response}`);
            }
        })
    } catch (err) {
        console.log(err);
        const error_message = errorhandel(err);
        res.status(401).json({ message: error_message });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const userdata = await usermodel.findOne({ email: email });

        if (!userdata) {
            return res.status(401).send({ message: "Enter valid registered Email Id" });
        }

        let tokendata = await Token.findOne({ userid: userdata._id });
        if (!tokendata) {
            const rs = randomstring.generate();
            tokendata = new Token({
                userid: userdata._id,
                token: rs
            });
            await tokendata.save();
        }

        sendresetpasswordmail(userdata.name, userdata.email, tokendata.token);
        return res.status(200).send({ message: "Reset Password Link has been sent to your email" })

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.message });
    }

}


const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        console.log("Received reset token:", token);
        console.log("New password attempt:", password);

        const tokendata = await Token.findOne({ token });
        if (!tokendata) {
            console.log("Token not found or expired.");
            return res.status(404).send({ message: "Invalid or expired token" });
        }

        // const hashedPassword = await bcrypt.hash(password, 10);

        const user = await usermodel.findById(tokendata.userid);
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }

        console.log("Hashed Password before saving:", password);
        user.password = password;

        await user.save({ validateBeforeSave: false});

        // Delete the token after successful password reset
        await tokendata.deleteOne();

        console.log("Password reset successfully for user:", tokendata.userid);
        return res.status(200).send({ message: "Password changed successfully" });
    } catch (error) {
        console.error("General error in resetPassword function:", error);
        res.status(500).json({ message: "An error occurred. Please try again later." });
    }
};



const profile_get = async (req, res) => {
    try {
      const userId = req.user._id; // Extracted from token by `validatetoken` middleware
      const user = await usermodel.findById(userId, 'name phone email isOwner'); // Only select necessary fields
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while retrieving profile data' });
    }
  };
  
  const profile_update = async (req, res) => {
    try {
      const userId = req.user._id; // Extracted from token by `validatetoken` middleware
      const { name, phone, email } = req.body;
  
      // Check if email is already in use by another user
      const existingUser = await usermodel.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(409).json({ message: 'Email is already in use' });
      }
  
      const user = await usermodel.findByIdAndUpdate(
        userId,
        { name, phone, email },
        { new: true, runValidators: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'An error occurred while updating profile' });
    }
  };
  
  module.exports = { signup_post, login_post, forgotPassword, resetPassword, profile_get, profile_update };