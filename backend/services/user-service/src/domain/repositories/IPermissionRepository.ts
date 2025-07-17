import { Permission } from '../entities/Permission';

export interface IPermissionRepository {
  create(permission: Permission): Promise<Permission>;
  findById(id: string): Promise<Permission | null>;
  findByName(name: string): Promise<Permission | null>;
  findAll(): Promise<Permission[]>;
  findByResource(resource: string): Promise<Permission[]>;
  findByAction(action: string): Promise<Permission[]>;
  update(id: string, permission: Partial<Permission>): Promise<Permission | null>;
  delete(id: string): Promise<boolean>;
  findByIds(ids: string[]): Promise<Permission[]>;
}