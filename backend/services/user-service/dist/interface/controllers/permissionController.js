"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionController = void 0;
const CreatePermissionUseCase_1 = require("../../domain/usecases/permission/CreatePermissionUseCase");
const GetAllPermissionsUseCase_1 = require("../../domain/usecases/permission/GetAllPermissionsUseCase");
const PermissionRepository_1 = require("../../infrastructure/repositories/PermissionRepository");
class PermissionController {
    constructor() {
        this.createPermission = async (req, res) => {
            try {
                const { name, description, resource, action } = req.body;
                if (!name || !description || !resource || !action) {
                    res.status(400).json({ message: 'Name, description, resource, and action are required' });
                    return;
                }
                const permission = await this.createPermissionUseCase.execute({ name, description, resource, action });
                res.status(201).json(permission);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        };
        this.getAllPermissions = async (req, res) => {
            try {
                const permissions = await this.getAllPermissionsUseCase.execute();
                res.json(permissions);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        };
        const permissionRepository = new PermissionRepository_1.PermissionRepository();
        this.createPermissionUseCase = new CreatePermissionUseCase_1.CreatePermissionUseCase(permissionRepository);
        this.getAllPermissionsUseCase = new GetAllPermissionsUseCase_1.GetAllPermissionsUseCase(permissionRepository);
    }
}
exports.PermissionController = PermissionController;
