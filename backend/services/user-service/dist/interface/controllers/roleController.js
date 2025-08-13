"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const CreateRoleUseCase_1 = require("../../domain/usecases/role/CreateRoleUseCase");
const GetRoleByIdUseCase_1 = require("../../domain/usecases/role/GetRoleByIdUseCase");
const GetAllRolesUseCase_1 = require("../../domain/usecases/role/GetAllRolesUseCase");
const UpdateRoleUseCase_1 = require("../../domain/usecases/role/UpdateRoleUseCase");
const DeleteRoleUseCase_1 = require("../../domain/usecases/role/DeleteRoleUseCase");
const RoleRepository_1 = require("../../infrastructure/repositories/RoleRepository");
const PermissionRepository_1 = require("../../infrastructure/repositories/PermissionRepository");
const UserRepository_1 = require("../../infrastructure/repositories/UserRepository");
class RoleController {
    constructor() {
        this.createRole = async (req, res) => {
            try {
                const { name, description, permissions } = req.body;
                if (!name || !description || !permissions || !Array.isArray(permissions)) {
                    res.status(400).json({ message: 'Name, description, and permissions are required' });
                    return;
                }
                const role = await this.createRoleUseCase.execute({ name, description, permissions });
                res.status(201).json(role);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        };
        this.getRoleById = async (req, res) => {
            try {
                const { id } = req.params;
                const role = await this.getRoleByIdUseCase.execute(id);
                if (!role) {
                    res.status(404).json({ message: 'Role not found' });
                    return;
                }
                res.json(role);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        };
        this.getAllRoles = async (req, res) => {
            try {
                const roles = await this.getAllRolesUseCase.execute();
                res.json(roles);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        };
        this.updateRole = async (req, res) => {
            try {
                const { id } = req.params;
                const updateData = req.body;
                const role = await this.updateRoleUseCase.execute(id, updateData);
                if (!role) {
                    res.status(404).json({ message: 'Role not found' });
                    return;
                }
                res.json(role);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        };
        this.deleteRole = async (req, res) => {
            try {
                const { id } = req.params;
                const deleted = await this.deleteRoleUseCase.execute(id);
                if (!deleted) {
                    res.status(404).json({ message: 'Role not found' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        };
        const roleRepository = new RoleRepository_1.RoleRepository();
        const permissionRepository = new PermissionRepository_1.PermissionRepository();
        const userRepository = new UserRepository_1.UserRepository();
        this.createRoleUseCase = new CreateRoleUseCase_1.CreateRoleUseCase(roleRepository, permissionRepository);
        this.getRoleByIdUseCase = new GetRoleByIdUseCase_1.GetRoleByIdUseCase(roleRepository);
        this.getAllRolesUseCase = new GetAllRolesUseCase_1.GetAllRolesUseCase(roleRepository);
        this.updateRoleUseCase = new UpdateRoleUseCase_1.UpdateRoleUseCase(roleRepository, permissionRepository);
        this.deleteRoleUseCase = new DeleteRoleUseCase_1.DeleteRoleUseCase(roleRepository, userRepository);
    }
}
exports.RoleController = RoleController;
