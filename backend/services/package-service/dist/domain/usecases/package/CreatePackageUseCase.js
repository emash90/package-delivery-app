"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePackageUseCase = void 0;
class CreatePackageUseCase {
    constructor(packageRepository, messagePublisher) {
        this.packageRepository = packageRepository;
        this.messagePublisher = messagePublisher;
    }
    async execute(packageData) {
        // Generate a unique tracking ID
        packageData.trackingId = `PKG${Date.now()}${Math.floor(Math.random() * 1000)}`;
        const newPackage = await this.packageRepository.create(packageData);
        console.log("newPackage", newPackage);
        // Publish package created event
        await this.messagePublisher.publish('package.created', {
            id: newPackage._id,
            ownerId: newPackage.userId,
            status: newPackage.status,
            trackingId: newPackage.trackingId,
            createdAt: newPackage.createdAt,
            updatedAt: newPackage.updatedAt,
            name: newPackage.name,
            description: newPackage.description,
            weight: newPackage.weight,
            dimensions: newPackage.dimensions,
            recipientName: newPackage.recipientName,
            recipientAddress: newPackage.location,
            recipientContact: newPackage.recipientContact,
            estimatedDeliveryTime: newPackage.eta,
            lastUpdate: newPackage.eta ? new Date(newPackage.eta) : null,
            images: newPackage.images
        });
        return newPackage;
    }
}
exports.CreatePackageUseCase = CreatePackageUseCase;
