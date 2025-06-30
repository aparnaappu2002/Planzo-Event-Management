import { IvendorDatabaseRepositoryInterface } from "../../../domain/interfaces/repositoryInterfaces/vendor/vendorDatabaseRepository";
import { IresetMailService } from "../../../domain/interfaces/serviceInterface/IresetMailService";
import { ITokenService } from "../../../domain/interfaces/serviceInterface/ITokenService";
import { IsendForForgetPasswordVendor as IUseCase } from "../../../domain/interfaces/useCaseInterfaces/vendor/authentication/sendForgotPasswordVendorInterface";

export class SendResetEmailForForgetPasswordVendor implements IUseCase {
    private resetEmailService: IresetMailService;
    private tokenService: ITokenService;
    private vendorDatabase: IvendorDatabaseRepositoryInterface;
    
    constructor(
        resetEmailService: IresetMailService, 
        tokenService: ITokenService, 
        vendorDatabase: IvendorDatabaseRepositoryInterface
    ) {
        this.resetEmailService = resetEmailService;
        this.tokenService = tokenService;
        this.vendorDatabase = vendorDatabase;
    }
    
    async sendMailForForgetPassword(email: string): Promise<void> {
        const vendor = await this.vendorDatabase.findByEmail(email);
        if (!vendor) throw new Error('No Vendor Found with this email');
       // if (vendor.googleVerified) throw new Error('This account is linked to Google. Please reset your password through your Google account settings');
        
        const resetToken = this.tokenService.generateResetToken(email);
        const resetUrl = `${process.env.ORIGIN}/vendor/resetPassword?token=${resetToken}&email=${email}`;
        
        await this.tokenService.storeResetToken(email, resetToken);
        await this.resetEmailService.sendPasswordResetEmail(email, resetToken, resetUrl);
    }
}