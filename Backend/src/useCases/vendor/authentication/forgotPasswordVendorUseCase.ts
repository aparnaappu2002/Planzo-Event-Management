import { VendorEntity } from "../../../domain/entities/vendorEntity";
import { IvendorDatabaseRepositoryInterface } from "../../../domain/interfaces/repositoryInterfaces/vendor/vendorDatabaseRepository";
import { ITokenService } from "../../../domain/interfaces/serviceInterface/ITokenService";
import bcrypt from 'bcrypt';
import { IresetPasswordVendorUseCase as IUseCase } from "../../../domain/interfaces/useCaseInterfaces/vendor/authentication/forgotPasswordVendorUseCase";

export class ResetPasswordVendorUseCase implements IUseCase {
    private tokenService: ITokenService;
    private vendorDatabase: IvendorDatabaseRepositoryInterface;
    
    constructor(
        tokenService: ITokenService, 
        vendorDatabase: IvendorDatabaseRepositoryInterface
    ) {
        this.tokenService = tokenService;
        this.vendorDatabase = vendorDatabase;
    }
    
    async resetPassword(email: string, newPassword: string, token: string): Promise<VendorEntity> {
        
        const isValidToken = await this.tokenService.verifyResetToken(email, token);
        if (!isValidToken) {
            throw new Error('Invalid or expired reset token');
        }
        
        
        const vendor = await this.vendorDatabase.findByEmail(email);
        if (!vendor) {
            throw new Error('No Vendor Found with this email');
        }
        
        // Check if vendor account is approved
        if (vendor.vendorStatus !== 'approved') {
            throw new Error('Vendor account is not approved. Please contact support.');
        }
        
        // Check if vendor account is active
        if (vendor.status === 'block') {
            throw new Error('Vendor account is blocked. Please contact support.');
        }
        
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        
       
        const updatedVendor = await this.vendorDatabase.resetPassword(vendor.vendorId, hashedPassword);
        
        
        if (!updatedVendor) {
            throw new Error('Failed to update password. Vendor may no longer exist.');
        }
        
        
        await this.tokenService.deleteResetToken(email, token);
        
        return updatedVendor;
    }
}