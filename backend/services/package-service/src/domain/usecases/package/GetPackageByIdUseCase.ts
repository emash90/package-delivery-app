
import { Package } from '../../entities/Package';
import { IPackageRepository } from '../../repositories/IPackageRepository';

export class GetPackageByIdUseCase {
  constructor(private packageRepository: IPackageRepository) {}

  async execute(id: string): Promise<Package | null> {
    return this.packageRepository.findById(id);
  }
}
