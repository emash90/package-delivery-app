
import { Package } from '../entities/Package';

export interface IPackageRepository {
  findAll(): Promise<Package[]>;
  findById(id: string): Promise<Package | null>;
  findByOwnerId(ownerId: string): Promise<Package[]>;
  findByStatus(status: string): Promise<Package[]>;
  findByTrackingId(trackingId: string): Promise<Package | null>;
  create(packageData: Package): Promise<Package>;
  update(id: string, packageData: Partial<Package>): Promise<Package | null>;
  delete(id: string): Promise<boolean>;
}
