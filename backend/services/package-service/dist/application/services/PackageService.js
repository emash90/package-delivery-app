"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageService = void 0;
const GetAllPackagesUseCase_1 = require("../../domain/usecases/package/GetAllPackagesUseCase");
const GetPackageByIdUseCase_1 = require("../../domain/usecases/package/GetPackageByIdUseCase");
const CreatePackageUseCase_1 = require("../../domain/usecases/package/CreatePackageUseCase");
const GetAvailablePackagesUseCase_1 = require("../../domain/usecases/package/GetAvailablePackagesUseCase");
const GetPackagesByOwnerIdUseCase_1 = require("../../domain/usecases/package/GetPackagesByOwnerIdUseCase");
const TrackPackageUseCase_1 = require("../../domain/usecases/package/TrackPackageUseCase");
class PackageService {
    constructor(packageRepository, messagePublisher) {
        this.packageRepository = packageRepository;
        this.messagePublisher = messagePublisher;
        this.getAllPackagesUseCase = new GetAllPackagesUseCase_1.GetAllPackagesUseCase(packageRepository);
        this.getPackageByIdUseCase = new GetPackageByIdUseCase_1.GetPackageByIdUseCase(packageRepository);
        this.getPackagesByOwnerIdUseCase = new GetPackagesByOwnerIdUseCase_1.GetPackagesByOwnerIdUseCase(packageRepository);
        this.createPackageUseCase = new CreatePackageUseCase_1.CreatePackageUseCase(packageRepository, messagePublisher);
        this.getAvailablePackagesUseCase = new GetAvailablePackagesUseCase_1.GetAvailablePackagesUseCase(packageRepository);
        this.trackPackageUseCase = new TrackPackageUseCase_1.TrackPackageUseCase(packageRepository);
    }
    async getAllPackages() {
        return this.getAllPackagesUseCase.execute();
    }
    async getPackageById(id) {
        return this.getPackageByIdUseCase.execute(id);
    }
    async getPackagesByOwnerId(ownerId) {
        return this.getPackagesByOwnerIdUseCase.execute(ownerId);
    }
    async getAvailablePackages() {
        return this.getAvailablePackagesUseCase.execute();
    }
    async trackPackage(trackingId) {
        return this.trackPackageUseCase.execute(trackingId);
    }
    async createPackage(packageData) {
        return this.createPackageUseCase.execute(packageData);
    }
    async updatePackage(id, packageData) {
        const updatedPackage = await this.packageRepository.update(id, packageData);
        if (updatedPackage) {
            // Publish package updated event
            await this.messagePublisher.publish('package.updated', {
                id: updatedPackage._id,
                status: updatedPackage.status,
                trackingId: updatedPackage.trackingId
            });
        }
        return updatedPackage;
    }
}
exports.PackageService = PackageService;
