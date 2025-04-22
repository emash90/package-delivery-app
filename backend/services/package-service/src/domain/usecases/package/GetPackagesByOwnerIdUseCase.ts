import { Package } from '../../entities/Package';
import { IPackageRepository } from '../../repositories/IPackageRepository';

export class GetPackagesByOwnerIdUseCase {
  constructor(private packageRepository: IPackageRepository) {}

  async execute(userId: string): Promise<Package[]> {
    return this.packageRepository.findByOwnerId(userId);
  }
}
