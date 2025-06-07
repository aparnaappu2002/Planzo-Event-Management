import { VendorEntity } from "../../../domain/entities/vendorEntity";
import { IvendorDatabaseRepositoryInterface } from "../../../domain/interfaces/repositoryInterfaces/vendor/vendorDatabaseRepository";
import { IrejectVendorUseCase } from "../../../domain/interfaces/useCaseInterfaces/admin/rejectedVendorUseCaseInterface";
import { IRejectVendorEmailService } from "../../../domain/interfaces/serviceInterface/IrejectVendorEmailService";

export class RejectVendorUseCase implements IrejectVendorUseCase {
    private vendorDatabase: IvendorDatabaseRepositoryInterface;
    private emailService: IRejectVendorEmailService;
    
    constructor(
        vendorDatabase: IvendorDatabaseRepositoryInterface,
        emailService: IRejectVendorEmailService
    ) {
        this.vendorDatabase = vendorDatabase;
        this.emailService = emailService;
    }
    
    async rejectVendor(vendorid: string, newStatus: string, rejectionReason: string): Promise<VendorEntity> {
        const existingVendor = await this.vendorDatabase.findById(vendorid);
        if (!existingVendor) throw new Error('No vendor exists');
        
        const vendor = await this.vendorDatabase.rejectPendingVendor(vendorid, newStatus, rejectionReason);
        
        
        try {
            await this.emailService.sendVendorRejectionEmail(
                vendor.email, 
                vendor.name, 
                rejectionReason
            );
            console.log(`Rejection email sent to vendor: ${vendor.email}`);
        } catch (emailError) {
            console.error(`Failed to send rejection email to ${vendor.email}:`, emailError);
            
        }
        
        return vendor;
    }
}