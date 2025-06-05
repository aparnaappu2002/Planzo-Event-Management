import { IClientDatabaseRepository } from "../../../domain/interfaces/repositoryInterfaces/client/clientDatabaseRepository";
import { IresetMailService } from "../../../domain/interfaces/serviceInterface/IresetMailService";
import { ITokenService } from "../../../domain/interfaces/serviceInterface/ITokenService";
import { IsendForForgetPasswordClient as IUseCase } from "../../../domain/interfaces/useCaseInterfaces/client/authentication/sendPasswordResetInterface";

export class SendResetEmailForForgetPassword implements IUseCase {
    private resetEmailService: IresetMailService;
    private tokenService: ITokenService;
    private clientDatabase: IClientDatabaseRepository;
    
    constructor(
        resetEmailService: IresetMailService, 
        tokenService: ITokenService, 
        clientDatabase: IClientDatabaseRepository
    ) {
        this.resetEmailService = resetEmailService;
        this.tokenService = tokenService;
        this.clientDatabase = clientDatabase;
    }
    
    async sendOtpForForgetPassword(email: string): Promise<void> {
        const client = await this.clientDatabase.findByEmail(email);
        if (!client) throw new Error('No Client Found with this email');
        if (client.googleVerified) throw new Error('This account is linked to Google. Please reset your password through your Google account settings');
        
        const resetToken = this.tokenService.generateResetToken(email);
        const resetUrl = `${process.env.ORIGIN}/resetPassword?token=${resetToken}&email=${email}`;
        
        await this.tokenService.storeResetToken(email, resetToken);
        await this.resetEmailService.sendPasswordResetEmail(email, resetToken, resetUrl);
    }
}