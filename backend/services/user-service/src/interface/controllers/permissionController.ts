import { Request, Response } from 'express';
import { CreatePermissionUseCase } from '../../domain/usecases/permission/CreatePermissionUseCase';
import { GetAllPermissionsUseCase } from '../../domain/usecases/permission/GetAllPermissionsUseCase';
import { PermissionRepository } from '../../infrastructure/repositories/PermissionRepository';

export class PermissionController {
  private createPermissionUseCase: CreatePermissionUseCase;
  private getAllPermissionsUseCase: GetAllPermissionsUseCase;

  constructor() {
    const permissionRepository = new PermissionRepository();
    this.createPermissionUseCase = new CreatePermissionUseCase(permissionRepository);
    this.getAllPermissionsUseCase = new GetAllPermissionsUseCase(permissionRepository);
  }

  createPermission = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description, resource, action } = req.body;

      if (!name || !description || !resource || !action) {
        res.status(400).json({ message: 'Name, description, resource, and action are required' });
        return;
      }

      const permission = await this.createPermissionUseCase.execute({ name, description, resource, action });
      res.status(201).json(permission);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  };

  getAllPermissions = async (req: Request, res: Response): Promise<void> => {
    try {
      const permissions = await this.getAllPermissionsUseCase.execute();
      res.json(permissions);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };
}