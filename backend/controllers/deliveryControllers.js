const asyncHandler = require("express-async-handler");
const Delivery = require("../models/deliveryModel");
const User = require("../models/userModel");

const getAllDeliveries = asyncHandler(async (req, res) => {
    try {
        const allDeliveries = await Delivery.find().sort({ createdAt: -1 });
        res.status(200).json(allDeliveries);
    } catch (error) {
        res.status(500);
        throw new Error("error occured");
    }
});

const getDelivery = asyncHandler(async (req, res) => {
    try {
        const allDelivery = await Delivery.find({ user_id: req.user.id }).sort({
            createdAt: -1,
        });
        res.status(200).json(allDelivery);
    } catch (error) {
        res.status(500);
        throw new Error("error occured");
    }
});
const getOneDelivery = asyncHandler(async (req, res) => {
    try {
        const oneDelivery = await Delivery.findById(req.params.id);
        if (!oneDelivery) {
            res.status(401);
            throw new Error("no delivery with that id");
        }
        res.status(200).json(oneDelivery);
    } catch (error) {
        res.status(500);
        throw new Error("error occured");
    }
});

const createDelivery = asyncHandler(async (req, res) => {
    try {
        const newDelivery = new Delivery({
            user_id: req.user.id,
            packageId: req.body.packageId,
            pickup_time: req.body.pickup_time,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            status: req.body.status,
            packageDescription: req.body.packageDescription,
            packageTo: req.body.packageTo,
            packageFrom: req.body.packageFrom
        });
        console.log(req.body);
        newDelivery.save();
        res.status(201).json(newDelivery);
    } catch (error) {
        res.status(500);
        throw new Error("error occured");
    }
});

const updateDelivery = asyncHandler(async (req, res) => {
    try {
        const deliveryToUpdate = await Delivery.findById(req.params.id);
        if (!deliveryToUpdate) {
            res.status(401);
            throw new Error("cannot find package with that id");
        }
        const user = await User.findById(req.user.id);

        //check for user

        if (!user) {
            res.status(401);
            throw new Error("User not found");
        }
        //ensure user only updates own goals

        if (deliveryToUpdate.user_id.toString() !== user.id) {
            res.status(401);
            throw new Error("User not authorised");
        }
        const updatedDelivery = await Delivery.findOneAndUpdate(
            { _id: deliveryToUpdate.id },
            req.body,
            { new: true, runValidators: true }
        );
        console.log(updatedDelivery);
        res.status(200).json(deliveryToUpdate);
    } catch (error) {
        res.status(500);
        throw new Error("error occured");
    }
});

const deleteDelivery = asyncHandler(async (req, res) => {
    try {
        const deliveryDelete = await Delivery.findById(req.params.id);
        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(400);
            throw new Error("User not found");
        }
        if (deliveryDelete.user_id.toString() !== user.id) {
            res.status(400);
            throw new Error("User not authorised");
        }
        const deliveryToDelete = await Delivery.findByIdAndDelete(
            deliveryDelete.id
        );
        if (!deliveryToDelete) {
            res.status(401);
            throw new Error("cannot find delivery with that id");
        }
        res.status(200).json(deliveryToDelete.id);
    } catch (error) {
        res.status(500);
        throw new Error("error occured");
    }
});

module.exports = {
    getAllDeliveries,
    getDelivery,
    getOneDelivery,
    createDelivery,
    updateDelivery,
    deleteDelivery,
};
