const asyncHandler = require("express-async-handler");
const Package = require("../models/packageModel");
const User = require("../models/userModel");

const getAllPackages = asyncHandler(async (req, res) => {
    try {
        const allPackages = await Package.find().sort({ createdAt: -1 });
        res.status(200).json(allPackages);
    } catch (error) {
        res.status(500);
        throw new Error("error occured");
    }
});

const getPackage = asyncHandler(async (req, res) => {
    try {
        const allPackage = await Package.find({ user_id: req.user.id }).sort({
            createdAt: -1,
        });
        res.status(200).json(allPackage);
    } catch (error) {
        res.status(500);
        throw new Error("error occured");
    }
});
const getOnePackage = asyncHandler(async (req, res) => {
    try {
        const onePackage = await Package.findById(req.params.id);
        if (!onePackage) {
            res.status(401);
            throw new Error("no package with the specified id");
        }
        res.status(200).json(onePackage);
    } catch (error) {
        res.status(500);
        throw new Error("error occured");
    }
});
const createPackage = asyncHandler(async (req, res) => {
    try {
        const newPackage = new Package({
            packageCreator: req.user.firstName,
            user_id: req.user.id,
            description: req.body.description,
            packageStatus: req.body.packageStatus,
            driverEmail: req.body.driverEmail,
            weight: req.body.weight,
            height: req.body.height,
            width: req.body.width,
            depth: req.body.depth,
            from_name: req.body.from_name,
            from_address: req.body.from_address,
            from_location: {
                latitude: req.body.from_locationLatitude,
                longitude: req.body.from_locationLongitude,
            },
            to_name: req.body.to_name,
            to_address: req.body.to_address,
            to_location: {
                latitude: req.body.to_locationLatitude,
                longitude: req.body.to_locationLongitude,
            },
        });
        console.log(newPackage);
        newPackage.save();
        console.log(newPackage.from_location);
        res.status(201).json(newPackage);
    } catch (error) {
        res.status(500);
        throw new Error("error occured");
    }
});
const updatePackage = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;
        const packageToUpdate = await Package.findById(userId);
        if (!packageToUpdate) {
            return res.status(401).json("cannot find package with that id");
        }
        // const user = await User.findById(req.user.id);
        // //check for user
        // if (!user) {
        //     return res.status(400).json("User not found");
        // }
        // //ensure user only updates own goals
        // if (packageToUpdate.user_id.toString() !== user.id) {
        //     return res.status(400).json("User not authorised");
        // }
        const updatedPackage = await Package.findByIdAndUpdate(
            { _id: packageToUpdate.id },
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json(updatedPackage);
    } catch (error) {
        res.status(500);
        throw new Error("error occured");
    }
});
const deletePackage = asyncHandler(async (req, res) => {
    try {
        const packageDelete = await Package.findById(req.params.id);
        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(400);
            throw new Error("User not found");
        }
        if (packageDelete.user_id.toString() !== user.id) {
            res.status(400);
            throw new Error("User not authorised");
        }
        const packageToDelete = await Package.findByIdAndDelete(
            packageDelete.id
        );
        if (!packageToDelete) {
            res.status(400);
            throw new Error("cannot find package with that id");
        }
        res.status(200).json(packageDelete.id);
    } catch (error) {
        res.status(500);
        throw new Error("error occured");
    }
});

module.exports = {
    getAllPackages,
    getPackage,
    getOnePackage,
    createPackage,
    updatePackage,
    deletePackage,
};
