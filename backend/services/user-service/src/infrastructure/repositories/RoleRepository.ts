import { IRoleRepository } from '../../domain/repositories/IRoleRepository';
import { Role } from '../../domain/entities/Role';
import { RoleModel } from '../models/RoleModel';

export class RoleRepository implements IRoleRepository {
  async create(role: Role): Promise<Role> {
    const newRole = new RoleModel(role);
    const savedRole = await newRole.save();
    return savedRole.toObject();
  }

  async findById(id: string): Promise<Role | null> {
    const role = await RoleModel.findById(id).populate('permissions');
    return role ? role.toObject() : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const role = await RoleModel.findOne({ name }).populate('permissions');
    return role ? role.toObject() : null;
  }

  async findAll(): Promise<Role[]> {
    const roles = await RoleModel.find().populate('permissions');
    return roles.map(role => role.toObject());
  }

  async findActive(): Promise<Role[]> {
    const roles = await RoleModel.find({ isActive: true }).populate('permissions');
    return roles.map(role => role.toObject());
  }

  async update(id: string, role: Partial<Role>): Promise<Role | null> {
    const updatedRole = await RoleModel.findByIdAndUpdate(
      id,
      { $set: role },
      { new: true }
    ).populate('permissions');
    return updatedRole ? updatedRole.toObject() : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await RoleModel.findByIdAndDelete(id);
    return !!result;
  }

  async addPermission(roleId: string, permissionId: string): Promise<boolean> {
    const result = await RoleModel.findByIdAndUpdate(
      roleId,
      { $addToSet: { permissions: permissionId } },
      { new: true }
    );
    return !!result;
  }

  async removePermission(roleId: string, permissionId: string): Promise<boolean> {
    const result = await RoleModel.findByIdAndUpdate(
      roleId,
      { $pull: { permissions: permissionId } },
      { new: true }
    );
    return !!result;
  }
}