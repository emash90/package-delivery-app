"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const UserModel_1 = require("../models/UserModel");
class UserRepository {
    async findByEmail(email) {
        const user = await UserModel_1.UserModel.findOne({ email });
        if (!user)
            return null;
        return this.mapToUser(user);
    }
    async findById(id) {
        const user = await UserModel_1.UserModel.findById(id);
        if (!user)
            return null;
        return this.mapToUser(user);
    }
    async create(userData) {
        const user = new UserModel_1.UserModel(userData);
        await user.save();
        return this.mapToUser(user);
    }
    async update(id, userData) {
        const user = await UserModel_1.UserModel.findByIdAndUpdate(id, userData, { new: true });
        if (!user)
            return null;
        return this.mapToUser(user);
    }
    async delete(id) {
        const result = await UserModel_1.UserModel.findByIdAndDelete(id);
        return !!result;
    }
    async findAll() {
        const users = await UserModel_1.UserModel.find();
        return users.map(user => this.mapToUser(user));
    }
    async findByRoleId(roleId) {
        const users = await UserModel_1.UserModel.find({ roleId });
        return users.map(user => this.mapToUser(user));
    }
    async updateLastLogin(id) {
        await UserModel_1.UserModel.findByIdAndUpdate(id, { lastLogin: new Date() });
    }
    mapToUser(userDoc) {
        var _a, _b, _c;
        return {
            id: (_a = userDoc._id) === null || _a === void 0 ? void 0 : _a.toString(),
            name: userDoc.name,
            email: userDoc.email,
            password: userDoc.password,
            role: userDoc.role,
            roleId: (_b = userDoc.roleId) === null || _b === void 0 ? void 0 : _b.toString(),
            permissions: (_c = userDoc.permissions) === null || _c === void 0 ? void 0 : _c.map(p => p.toString()),
            status: userDoc.status,
            lastLogin: userDoc.lastLogin,
            createdAt: userDoc.createdAt,
            updatedAt: userDoc.updatedAt
        };
    }
}
exports.UserRepository = UserRepository;
