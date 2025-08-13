"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllRolesUseCase = void 0;
class GetAllRolesUseCase {
    constructor(roleRepository) {
        this.roleRepository = roleRepository;
    }
    async execute() {
        return await this.roleRepository.findAll();
    }
}
exports.GetAllRolesUseCase = GetAllRolesUseCase;
