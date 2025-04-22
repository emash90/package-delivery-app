
import { Package } from '../../domain/entities/Package';
import { IPackageRepository } from '../../domain/repositories/IPackageRepository';
import { PackageModel } from '../models/PackageModel';
import { logger } from '../logger';
import { Types } from 'mongoose';

export class PackageRepository implements IPackageRepository {
  async findAll(): Promise<Package[]> {
    try {
      const packages = await PackageModel.find();
      return packages.map(pkg => pkg.toJSON() as Package);
    } catch (error) {
      logger.error('Error finding all packages:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Package | null> {
    try {
      const pkg = await PackageModel.findById(id);
      return pkg ? pkg.toJSON() as Package : null;
    } catch (error) {
      logger.error('Error finding package by ID:', error);
      throw error;
    }
  }

  async findByOwnerId(ownerId: string): Promise<Package[]> {
    try {
      const objectId = new Types.ObjectId(ownerId);
      console.log("object id", objectId)
      const packages = await PackageModel.find({ 
        userId: objectId
       });
      return packages.map(pkg => pkg.toJSON() as Package);
    } catch (error) {
      logger.error('Error finding packages by owner ID:', error);
      throw error;
    }
  }

  async findByStatus(status: string): Promise<Package[]> {
    try {
      const packages = await PackageModel.find({ status });
      return packages.map(pkg => pkg.toJSON() as Package);
    } catch (error) {
      logger.error('Error finding packages by status:', error);
      throw error;
    }
  }

  async findByTrackingId(trackingId: string): Promise<Package | null> {
    try {
      const pkg = await PackageModel.findOne({ trackingId });
      return pkg ? pkg.toJSON() as Package : null;
    } catch (error) {
      logger.error('Error finding package by tracking ID:', error);
      throw error;
    }
  }

  async create(packageData: Package): Promise<Package> {
    try {
      const newPackage = await PackageModel.create(packageData);
      return newPackage.toJSON() as Package;
    } catch (error) {
      logger.error('Error creating package:', error);
      throw error;
    }
  }

  async update(id: string, packageData: Partial<Package>): Promise<Package | null> {
    try {
      const updatedPackage = await PackageModel.findByIdAndUpdate(
        id,
        packageData,
        { new: true }
      );
      return updatedPackage ? updatedPackage.toJSON() as Package : null;
    } catch (error) {
      logger.error('Error updating package:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await PackageModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      logger.error('Error deleting package:', error);
      throw error;
    }
  }
}
