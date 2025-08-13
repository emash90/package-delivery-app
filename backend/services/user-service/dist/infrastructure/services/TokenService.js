"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenService {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || 'packaroo_default_secret';
        this.JWT_EXPIRES_IN = '1d'; // Use '1d' instead of '24h'
    }
    generateToken(payload) {
        const signOptions = {
            expiresIn: 86400, // 24 hours in seconds
        };
        return jsonwebtoken_1.default.sign(payload, this.JWT_SECRET, signOptions);
    }
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
        }
        catch (error) {
            return null;
        }
    }
}
exports.TokenService = TokenService;
