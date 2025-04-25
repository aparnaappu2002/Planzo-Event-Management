import { VendorEntity } from "../../../domain/entities/vendorEntity";
import { IvendorDatabaseRepositoryInterface } from "../../../domain/interfaces/repositoryInterfaces/vendor/vendorDatabaseRepository";
import { IfindAllRejectedVendor } from "../../../domain/interfaces/useCaseInterfaces/admin/findRejectedVendorsUsecaseInterface";
export class FindAllRejectedVendorUseCase implements IfindAllRejectedVendor {
    private vendorDatabase: IvendorDatabaseRepositoryInterface
    constructor(vendorDatabase: IvendorDatabaseRepositoryInterface) {
        this.vendorDatabase = vendorDatabase
    }
    async findRejectedVendors(pageNo: number): Promise<{ rejectedVendors: VendorEntity[] | []; totalPages: number; }> {
        const { rejectedVendors, totalPages } = await this.vendorDatabase.findAllRejectedVendor(pageNo)
        return { rejectedVendors, totalPages }
    }
}