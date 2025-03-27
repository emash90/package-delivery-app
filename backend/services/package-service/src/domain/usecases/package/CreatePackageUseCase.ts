
import { Package } from '../../entities/Package';
import { IPackageRepository } from '../../repositories/IPackageRepository';
import { IMessagePublisher } from '../../../application/services/IMessagePublisher';

export class CreatePackageUseCase {
  constructor(
    private packageRepository: IPackageRepository,
    private messagePublisher: IMessagePublisher
  ) {}

  async execute(packageData: Package): Promise<Package> {
    // Generate a unique tracking ID
    packageData.trackingId = `PKG${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    const newPackage = await this.packageRepository.create(packageData);
    
    // Publish package created event
    await this.messagePublisher.publish('package.created', {
      id: newPackage.id,
      ownerId: newPackage.ownerId,
      status: newPackage.status,
      trackingId: newPackage.trackingId
    });
    
    return newPackage;
  }
}
