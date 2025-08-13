"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRoleByIdUseCase = void 0;
class GetRoleByIdUseCase {
    constructor(roleRepository) {
        this.roleRepository = roleRepository;
    }
    async execute(id) {
        return await this.roleRepository.findById(id);
    }
}
exports.GetRoleByIdUseCase = GetRoleByIdUseCase;
