import { VendorEntity } from "../../../domain/entities/vendorEntity";
import { IvendorDatabaseRepositoryInterface } from "../../../domain/interfaces/repositoryInterfaces/vendor/vendorDatabaseRepository";
import { IrejectVendorUseCase } from "../../../domain/interfaces/useCaseInterfaces/admin/rejectedVendorUseCaseInterface";
export class RejectVendorUseCase implements IrejectVendorUseCase {
    private vendorDatabase: IvendorDatabaseRepositoryInterface
    constructor(vendorDatabase: IvendorDatabaseRepositoryInterface) {
        this.vendorDatabase = vendorDatabase
    }
    async rejectVendor(vendorid: string, newStatus: string, rejectionReason: string): Promise<VendorEntity> {
        const exitingVendor = await this.vendorDatabase.findById(vendorid)
        if (!exitingVendor) throw new Error('No vendor Exist')
        const vendor = await this.vendorDatabase.rejectPendingVendor(vendorid, newStatus, rejectionReason)
        return vendor
    }
}