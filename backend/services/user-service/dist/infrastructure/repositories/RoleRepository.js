"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const RoleModel_1 = require("../models/RoleModel");
class RoleRepository {
    async create(role) {
        const newRole = new RoleModel_1.RoleModel(role);
        const savedRole = await newRole.save();
        return savedRole.toObject();
    }
    async findById(id) {
        const role = await RoleModel_1.RoleModel.findById(id).populate('permissions');
        return role ? role.toObject() : null;
    }
    async findByName(name) {
        const role = await RoleModel_1.RoleModel.findOne({ name }).populate('permissions');
        return role ? role.toObject() : null;
    }
    async findAll() {
        const roles = await RoleModel_1.RoleModel.find().populate('permissions');
        return roles.map(role => role.toObject());
    }
    async findActive() {
        const roles = await RoleModel_1.RoleModel.find({ isActive: true }).populate('permissions');
        return roles.map(role => role.toObject());
    }
    async update(id, role) {
        const updatedRole = await RoleModel_1.RoleModel.findByIdAndUpdate(id, { $set: role }, { new: true }).populate('permissions');
        return updatedRole ? updatedRole.toObject() : null;
    }
    async delete(id) {
        const result = await RoleModel_1.RoleModel.findByIdAndDelete(id);
        return !!result;
    }
    async addPermission(roleId, permissionId) {
        const result = await RoleModel_1.RoleModel.findByIdAndUpdate(roleId, { $addToSet: { permissions: permissionId } }, { new: true });
        return !!result;
    }
    async removePermission(roleId, permissionId) {
        const result = await RoleModel_1.RoleModel.findByIdAndUpdate(roleId, { $pull: { permissions: permissionId } }, { new: true });
        return !!result;
    }
}
exports.RoleRepository = RoleRepository;
