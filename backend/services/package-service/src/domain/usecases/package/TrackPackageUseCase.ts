
import { Package } from '../../entities/Package';
import { IPackageRepository } from '../../repositories/IPackageRepository';

export class TrackPackageUseCase {
  constructor(private packageRepository: IPackageRepository) {}

  async execute(trackingId: string): Promise<Package | null> {
    return this.packageRepository.findByTrackingId(trackingId);
  }
}
