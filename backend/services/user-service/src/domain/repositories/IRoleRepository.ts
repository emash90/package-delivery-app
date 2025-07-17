import { Role } from '../entities/Role';

export interface IRoleRepository {
  create(role: Role): Promise<Role>;
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  findActive(): Promise<Role[]>;
  update(id: string, role: Partial<Role>): Promise<Role | null>;
  delete(id: string): Promise<boolean>;
  addPermission(roleId: string, permissionId: string): Promise<boolean>;
  removePermission(roleId: string, permissionId: string): Promise<boolean>;
}