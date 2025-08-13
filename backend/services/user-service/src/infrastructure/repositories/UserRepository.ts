
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserModel, UserDocument } from '../models/UserModel';

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    
    return this.mapToUser(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    if (!user) return null;
    
    return this.mapToUser(user);
  }

  async create(userData: User): Promise<User> {
    const user = new UserModel(userData);
    await user.save();
    
    return this.mapToUser(user);
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(id, userData, { new: true });
    if (!user) return null;
    
    return this.mapToUser(user);
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }

  async findAll(): Promise<User[]> {
    const users = await UserModel.find();
    return users.map(user => this.mapToUser(user));
  }

  async findByRoleId(roleId: string): Promise<User[]> {
    const users = await UserModel.find({ roleId });
    return users.map(user => this.mapToUser(user));
  }

  async updateLastLogin(id: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { lastLogin: new Date() });
  }

  private mapToUser(userDoc: UserDocument): User {
    return {
      id: userDoc._id?.toString(),
      name: userDoc.name,
      email: userDoc.email,
      password: userDoc.password,
      role: userDoc.role,
      roleId: userDoc.roleId?.toString(),
      permissions: userDoc.permissions?.map(p => p.toString()),
      status: userDoc.status,
      lastLogin: userDoc.lastLogin,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt
    };
  }
}
