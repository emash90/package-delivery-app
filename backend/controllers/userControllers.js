const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = asyncHandler(async (req, res) => {
    try {
        const { firstName, lastName, email, accountType, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(401).json({message: "please fill all fields"});
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({message: "User with that email address already exits"});
        }
        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create the user

        const user = await User.create({
            firstName,
            lastName,
            email,
            accountType,
            password: hashedPassword,
        });
        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.firstName,
                email: user.email,
                accountType: accountType,
                token: generateToken(user._id),
            });
        } else {
           return  res.status(400).json({message: "Invalid user data"});
        }
    } catch (error) {
        res.status(500).json({message: "error occured"});
    }
});

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(401).json({message: "ensure all fields are filled"})
        }
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            console.log(user);
            res.status(200).json({
                _id: user.id,
                name: user.firstName,
                email: user.email,
                userType: user.accountType,
                token: generateToken(user._id),
            });
        } else {
            return res.status(401).json({message: "Invalid credentials"});
        }
    } catch (error) {
        res.status(500).json({message: "error occured"});
    }
});

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const allUsers = await User.find();
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500);
        throw new Error({message: "error occured"});
    }
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
};
