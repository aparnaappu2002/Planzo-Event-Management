import { VendorEntity } from "../../../domain/entities/vendorEntity";
import { IvendorDatabaseRepositoryInterface } from "../../../domain/interfaces/repositoryInterfaces/vendor/vendorDatabaseRepository";
import { IreapplyVendorUseCase } from "../../../domain/interfaces/useCaseInterfaces/admin/vendorManagement/reapplyVendorUseCaseInterface";

export class ReapplyVendorUseCase implements IreapplyVendorUseCase {
    private vendorDatabase: IvendorDatabaseRepositoryInterface;
    
    constructor(
        vendorDatabase: IvendorDatabaseRepositoryInterface
    ) {
        this.vendorDatabase = vendorDatabase;
    }
    
    async reapplyVendor(vendorId: string, newStatus: string): Promise<VendorEntity> {
        const existingVendor = await this.vendorDatabase.findById(vendorId);
        if (!existingVendor) throw new Error('No vendor exists');
        
        const vendor = await this.vendorDatabase.reapplyVendor(vendorId, newStatus);
        
        return vendor;
    }
}