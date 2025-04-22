import { Package } from '../../domain/entities/Package';

export interface IPackageService {
  getAllPackages(): Promise<Package[]>;
  getPackageById(id: string): Promise<Package | null>;
  getPackagesByOwnerId(ownerId: string): Promise<Package[]>;
  getAvailablePackages(): Promise<Package[]>;
  trackPackage(trackingId: string): Promise<Package | null>;
  createPackage(packageData: Package): Promise<Package>;
  updatePackage(id: string, packageData: Partial<Package>): Promise<Package | null>;
}