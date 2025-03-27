
import { Package } from '../../entities/Package';
import { IPackageRepository } from '../../repositories/IPackageRepository';

export class GetAvailablePackagesUseCase {
  constructor(private packageRepository: IPackageRepository) {}

  async execute(): Promise<Package[]> {
    return this.packageRepository.findByStatus('processing');
  }
}
