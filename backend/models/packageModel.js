const mongoose = require("mongoose");
const Delivery = require("../models/deliveryModel");
const User = require("../models/userModel");

const packageSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        packageStatus: {
            type: String,
            required: true,
        },
        driverEmail: {
            type: String,
            require: true
        },
        packageCreator: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        weight: {
            type: Number,
            required: true,
        },
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        depth: {
            type: Number,
            required: true,
        },
        from_name: {
            type: String,
            required: true,
            uppercase: true,
        },
        from_address: {
            type: String,
            required: true,
            uppercase: true,
        },
        from_location: {
            latitude: {
                type: Number,
                required: false,
            },
            longitude: {
                type: Number,
                required: false,
            },
        },
        to_name: {
            type: String,
            required: true,
            uppercase: true,
        },
        to_address: {
            type: String,
            required: true,
            uppercase: true,
        },
        to_location: {
            latitude: {
                type: Number,
                required: false,
            },
            longitude: {
                type: Number,
                required: false,
            },
        },
    },
    {
        timestamps: true,
    }
);

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
