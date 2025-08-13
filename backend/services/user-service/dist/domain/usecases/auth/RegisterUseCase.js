"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUseCase = void 0;
class RegisterUseCase {
    constructor(userRepository, passwordService, tokenService, messagePublisher) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.tokenService = tokenService;
        this.messagePublisher = messagePublisher;
    }
    async execute(userData) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            return null;
        }
        const hashedPassword = await this.passwordService.hash(userData.password);
        const user = await this.userRepository.create({
            ...userData,
            password: hashedPassword
        });
        // Publish user created event
        await this.messagePublisher.publish('user.created', {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
        const token = this.tokenService.generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            token
        };
    }
}
exports.RegisterUseCase = RegisterUseCase;
