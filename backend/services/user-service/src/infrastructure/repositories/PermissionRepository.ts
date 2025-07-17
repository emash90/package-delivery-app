import { IPermissionRepository } from '../../domain/repositories/IPermissionRepository';
import { Permission } from '../../domain/entities/Permission';
import { PermissionModel } from '../models/PermissionModel';

export class PermissionRepository implements IPermissionRepository {
  async create(permission: Permission): Promise<Permission> {
    const newPermission = new PermissionModel(permission);
    const savedPermission = await newPermission.save();
    return savedPermission.toObject();
  }

  async findById(id: string): Promise<Permission | null> {
    const permission = await PermissionModel.findById(id);
    return permission ? permission.toObject() : null;
  }

  async findByName(name: string): Promise<Permission | null> {
    const permission = await PermissionModel.findOne({ name });
    return permission ? permission.toObject() : null;
  }

  async findAll(): Promise<Permission[]> {
    const permissions = await PermissionModel.find();
    return permissions.map(permission => permission.toObject());
  }

  async findByResource(resource: string): Promise<Permission[]> {
    const permissions = await PermissionModel.find({ resource });
    return permissions.map(permission => permission.toObject());
  }

  async findByAction(action: string): Promise<Permission[]> {
    const permissions = await PermissionModel.find({ action });
    return permissions.map(permission => permission.toObject());
  }

  async update(id: string, permission: Partial<Permission>): Promise<Permission | null> {
    const updatedPermission = await PermissionModel.findByIdAndUpdate(
      id,
      { $set: permission },
      { new: true }
    );
    return updatedPermission ? updatedPermission.toObject() : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await PermissionModel.findByIdAndDelete(id);
    return !!result;
  }

  async findByIds(ids: string[]): Promise<Permission[]> {
    const permissions = await PermissionModel.find({ _id: { $in: ids } });
    return permissions.map(permission => permission.toObject());
  }
}