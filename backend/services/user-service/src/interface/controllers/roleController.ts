import { Request, Response } from 'express';
import { CreateRoleUseCase } from '../../domain/usecases/role/CreateRoleUseCase';
import { GetRoleByIdUseCase } from '../../domain/usecases/role/GetRoleByIdUseCase';
import { GetAllRolesUseCase } from '../../domain/usecases/role/GetAllRolesUseCase';
import { UpdateRoleUseCase } from '../../domain/usecases/role/UpdateRoleUseCase';
import { DeleteRoleUseCase } from '../../domain/usecases/role/DeleteRoleUseCase';
import { RoleRepository } from '../../infrastructure/repositories/RoleRepository';
import { PermissionRepository } from '../../infrastructure/repositories/PermissionRepository';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

export class RoleController {
  private createRoleUseCase: CreateRoleUseCase;
  private getRoleByIdUseCase: GetRoleByIdUseCase;
  private getAllRolesUseCase: GetAllRolesUseCase;
  private updateRoleUseCase: UpdateRoleUseCase;
  private deleteRoleUseCase: DeleteRoleUseCase;

  constructor() {
    const roleRepository = new RoleRepository();
    const permissionRepository = new PermissionRepository();
    const userRepository = new UserRepository();

    this.createRoleUseCase = new CreateRoleUseCase(roleRepository, permissionRepository);
    this.getRoleByIdUseCase = new GetRoleByIdUseCase(roleRepository);
    this.getAllRolesUseCase = new GetAllRolesUseCase(roleRepository);
    this.updateRoleUseCase = new UpdateRoleUseCase(roleRepository, permissionRepository);
    this.deleteRoleUseCase = new DeleteRoleUseCase(roleRepository, userRepository);
  }

  createRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description, permissions } = req.body;

      if (!name || !description || !permissions || !Array.isArray(permissions)) {
        res.status(400).json({ message: 'Name, description, and permissions are required' });
        return;
      }

      const role = await this.createRoleUseCase.execute({ name, description, permissions });
      res.status(201).json(role);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  };

  getRoleById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const role = await this.getRoleByIdUseCase.execute(id);
      
      if (!role) {
        res.status(404).json({ message: 'Role not found' });
        return;
      }

      res.json(role);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  getAllRoles = async (req: Request, res: Response): Promise<void> => {
    try {
      const roles = await this.getAllRolesUseCase.execute();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  updateRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const role = await this.updateRoleUseCase.execute(id, updateData);
      
      if (!role) {
        res.status(404).json({ message: 'Role not found' });
        return;
      }

      res.json(role);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  };

  deleteRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.deleteRoleUseCase.execute(id);
      
      if (!deleted) {
        res.status(404).json({ message: 'Role not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  };
}