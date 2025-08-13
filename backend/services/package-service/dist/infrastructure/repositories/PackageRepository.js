"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageRepository = void 0;
const PackageModel_1 = require("../models/PackageModel");
const logger_1 = require("../logger");
const mongoose_1 = require("mongoose");
class PackageRepository {
    async findAll() {
        try {
            const packages = await PackageModel_1.PackageModel.find();
            return packages.map(pkg => pkg.toJSON());
        }
        catch (error) {
            logger_1.logger.error('Error finding all packages:', error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const pkg = await PackageModel_1.PackageModel.findById(id);
            return pkg ? pkg.toJSON() : null;
        }
        catch (error) {
            logger_1.logger.error('Error finding package by ID:', error);
            throw error;
        }
    }
    async findByOwnerId(ownerId) {
        try {
            const objectId = new mongoose_1.Types.ObjectId(ownerId);
            console.log("object id", objectId);
            const packages = await PackageModel_1.PackageModel.find({
                userId: objectId
            });
            return packages.map(pkg => pkg.toJSON());
        }
        catch (error) {
            logger_1.logger.error('Error finding packages by owner ID:', error);
            throw error;
        }
    }
    async findByStatus(status) {
        try {
            const packages = await PackageModel_1.PackageModel.find({ status });
            return packages.map(pkg => pkg.toJSON());
        }
        catch (error) {
            logger_1.logger.error('Error finding packages by status:', error);
            throw error;
        }
    }
    async findByTrackingId(trackingId) {
        try {
            const pkg = await PackageModel_1.PackageModel.findOne({ trackingId });
            return pkg ? pkg.toJSON() : null;
        }
        catch (error) {
            logger_1.logger.error('Error finding package by tracking ID:', error);
            throw error;
        }
    }
    async create(packageData) {
        try {
            const newPackage = await PackageModel_1.PackageModel.create(packageData);
            return newPackage.toJSON();
        }
        catch (error) {
            logger_1.logger.error('Error creating package:', error);
            throw error;
        }
    }
    async update(id, packageData) {
        try {
            const updatedPackage = await PackageModel_1.PackageModel.findByIdAndUpdate(id, packageData, { new: true });
            return updatedPackage ? updatedPackage.toJSON() : null;
        }
        catch (error) {
            logger_1.logger.error('Error updating package:', error);
            throw error;
        }
    }
    async delete(id) {
        try {
            const result = await PackageModel_1.PackageModel.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            logger_1.logger.error('Error deleting package:', error);
            throw error;
        }
    }
}
exports.PackageRepository = PackageRepository;
