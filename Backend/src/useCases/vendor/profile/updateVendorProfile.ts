import { VendorEntity } from "../../../domain/entities/vendorEntity";
import { IvendorDatabaseRepositoryInterface } from "../../../domain/interfaces/repositoryInterfaces/vendor/vendorDatabaseRepository";
import { IupdateAboutAndPhoneUseCase } from "../../../domain/interfaces/useCaseInterfaces/vendor/profile/updateProfileUsecase";
export class updateAboutAndPhoneUseCase implements IupdateAboutAndPhoneUseCase {
    private vendorDatabase: IvendorDatabaseRepositoryInterface
    constructor(vendorDatabase: IvendorDatabaseRepositoryInterface) {
        this.vendorDatabase = vendorDatabase
    }
    async updateAboutAndPhone(vendorId: string, about: string, phone: string,name:string): Promise<VendorEntity> {
        const updatedVendor = await this.vendorDatabase.updateAboutAndPhone(vendorId, about, phone,name)
        if(!updatedVendor) throw new Error('No vendor found in this ID')
            return updatedVendor
    }
}