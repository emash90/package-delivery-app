
import { Package } from '../../domain/entities/Package';
import { IPackageService } from './IPackageService';
import { IPackageRepository } from '../../domain/repositories/IPackageRepository';
import { GetAllPackagesUseCase } from '../../domain/usecases/package/GetAllPackagesUseCase';
import { GetPackageByIdUseCase } from '../../domain/usecases/package/GetPackageByIdUseCase';
import { CreatePackageUseCase } from '../../domain/usecases/package/CreatePackageUseCase';
import { GetAvailablePackagesUseCase } from '../../domain/usecases/package/GetAvailablePackagesUseCase';
import { GetPackagesByOwnerIdUseCase } from '../../domain/usecases/package/GetPackagesByOwnerIdUseCase';
import { TrackPackageUseCase } from '../../domain/usecases/package/TrackPackageUseCase';
import { MessagePublisher } from '../../infrastructure/messageBroker';

export class PackageService implements IPackageService {
  private getAllPackagesUseCase: GetAllPackagesUseCase;
  private getPackageByIdUseCase: GetPackageByIdUseCase;
  private getPackagesByOwnerIdUseCase: GetPackagesByOwnerIdUseCase;
  private createPackageUseCase: CreatePackageUseCase;
  private getAvailablePackagesUseCase: GetAvailablePackagesUseCase;
  private trackPackageUseCase: TrackPackageUseCase;
  
  constructor(
    private packageRepository: IPackageRepository,
    private messagePublisher: MessagePublisher
  ) {
    this.getAllPackagesUseCase = new GetAllPackagesUseCase(packageRepository);
    this.getPackageByIdUseCase = new GetPackageByIdUseCase(packageRepository);
    this.getPackagesByOwnerIdUseCase = new GetPackagesByOwnerIdUseCase(packageRepository);
    this.createPackageUseCase = new CreatePackageUseCase(packageRepository, messagePublisher);
    this.getAvailablePackagesUseCase = new GetAvailablePackagesUseCase(packageRepository);
    this.trackPackageUseCase = new TrackPackageUseCase(packageRepository);
  }
  
  async getAllPackages(): Promise<Package[]> {
    return this.getAllPackagesUseCase.execute();
  }
  
  async getPackageById(id: string): Promise<Package | null> {
    return this.getPackageByIdUseCase.execute(id);
  }
  
  async getPackagesByOwnerId(ownerId: string): Promise<Package[]> {
    return this.getPackagesByOwnerIdUseCase.execute(ownerId);
  }
  
  async getAvailablePackages(): Promise<Package[]> {
    return this.getAvailablePackagesUseCase.execute();
  }
  
  async trackPackage(trackingId: string): Promise<Package | null> {
    return this.trackPackageUseCase.execute(trackingId);
  }
  
  async createPackage(packageData: Package): Promise<Package> {
    return this.createPackageUseCase.execute(packageData);
  }
  
  async updatePackage(id: string, packageData: Partial<Package>): Promise<Package | null> {
    const updatedPackage = await this.packageRepository.update(id, packageData);
    
    if (updatedPackage) {
      // Publish package updated event
      await this.messagePublisher.publish('package.updated', {
        id: updatedPackage.id,
        status: updatedPackage.status,
        trackingId: updatedPackage.trackingId
      });
    }
    
    return updatedPackage;
  }
}
