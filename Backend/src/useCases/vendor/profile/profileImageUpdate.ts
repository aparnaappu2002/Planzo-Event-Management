import { VendorEntity } from "../../../domain/entities/vendorEntity";
import { IvendorDatabaseRepositoryInterface } from "../../../domain/interfaces/repositoryInterfaces/vendor/vendorDatabaseRepository";
import { IprofileImageUpdateUseCase } from "../../../domain/interfaces/useCaseInterfaces/vendor/profile/profileImageUpdateUseCase";
export class ProfileImageUpdateUseCase implements IprofileImageUpdateUseCase {
    private vendorDatabase: IvendorDatabaseRepositoryInterface
    constructor(vendorDatabase: IvendorDatabaseRepositoryInterface) {
        this.vendorDatabase = vendorDatabase
    }
    async uploadProfileImage(id: string, imageUrl: string): Promise<VendorEntity | null> {
        const vendor = await this.vendorDatabase.findById(id)
        if (!vendor) throw new Error('No vendor found in this email')
        const updateVendor = await this.vendorDatabase.updateProfileImage(id, imageUrl)
        if (!updateVendor) throw new Error('error while updating profile image in vendor side')
        return updateVendor
    }
}