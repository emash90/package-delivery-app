"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionRepository = void 0;
const PermissionModel_1 = require("../models/PermissionModel");
class PermissionRepository {
    async create(permission) {
        const newPermission = new PermissionModel_1.PermissionModel(permission);
        const savedPermission = await newPermission.save();
        return savedPermission.toObject();
    }
    async findById(id) {
        const permission = await PermissionModel_1.PermissionModel.findById(id);
        return permission ? permission.toObject() : null;
    }
    async findByName(name) {
        const permission = await PermissionModel_1.PermissionModel.findOne({ name });
        return permission ? permission.toObject() : null;
    }
    async findAll() {
        const permissions = await PermissionModel_1.PermissionModel.find();
        return permissions.map(permission => permission.toObject());
    }
    async findByResource(resource) {
        const permissions = await PermissionModel_1.PermissionModel.find({ resource });
        return permissions.map(permission => permission.toObject());
    }
    async findByAction(action) {
        const permissions = await PermissionModel_1.PermissionModel.find({ action });
        return permissions.map(permission => permission.toObject());
    }
    async update(id, permission) {
        const updatedPermission = await PermissionModel_1.PermissionModel.findByIdAndUpdate(id, { $set: permission }, { new: true });
        return updatedPermission ? updatedPermission.toObject() : null;
    }
    async delete(id) {
        const result = await PermissionModel_1.PermissionModel.findByIdAndDelete(id);
        return !!result;
    }
    async findByIds(ids) {
        const permissions = await PermissionModel_1.PermissionModel.find({ _id: { $in: ids } });
        return permissions.map(permission => permission.toObject());
    }
}
exports.PermissionRepository = PermissionRepository;
