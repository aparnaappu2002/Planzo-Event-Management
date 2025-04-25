import { VendorEntity } from "../../../domain/entities/vendorEntity";
import { IvendorDatabaseRepositoryInterface } from "../../../domain/interfaces/repositoryInterfaces/vendor/vendorDatabaseRepository";
import { IfindPendingVendors } from "../../../domain/interfaces/useCaseInterfaces/admin/findPendingVendor";
export class findAllPendingVendors implements IfindPendingVendors {
    private vendorDatabase: IvendorDatabaseRepositoryInterface
    constructor(vendorDatabase: IvendorDatabaseRepositoryInterface) {
        this.vendorDatabase = vendorDatabase
    }
    async findPendingVendors(pageNo: number): Promise<{ pendingVendors: VendorEntity[] | []; totalPages: number; }> {
        const {pendingVendors,totalPages} = await this.vendorDatabase.findAllPendingVendors(pageNo)
        return {pendingVendors,totalPages}
    }
}