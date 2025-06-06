import { clientEntity } from "../../../domain/entities/clientEntity";
import { IClientDatabaseRepository } from "../../../domain/interfaces/repositoryInterfaces/client/clientDatabaseRepository";
import { ITokenService } from "../../../domain/interfaces/serviceInterface/ITokenService";
import bcrypt from 'bcrypt';
import { IresetPasswordClientUseCase as IUseCase } from "../../../domain/interfaces/useCaseInterfaces/client/authentication/forgotPasswordUseCase";

export class ResetPasswordClientUseCase implements IUseCase {
    private tokenService: ITokenService;
    private clientDatabase: IClientDatabaseRepository;
    
    constructor(
        tokenService: ITokenService, 
        clientDatabase: IClientDatabaseRepository
    ) {
        this.tokenService = tokenService;
        this.clientDatabase = clientDatabase;
    }
    
    async resetPassword(email: string, newPassword: string, token: string): Promise<clientEntity> {
        // Verify the reset token
        const isValidToken = await this.tokenService.verifyResetToken(email, token);
        if (!isValidToken) {
            throw new Error('Invalid or expired reset token');
        }
        
        // Find the client
        const client = await this.clientDatabase.findByEmail(email);
        if (!client) {
            throw new Error('No Client Found with this email');
        }
        
        // Check if account is Google verified
        if (client.googleVerified) {
            throw new Error('This account is linked to Google. Please reset your password through your Google account settings');
        }
        
        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        
        // Update the client's password using clientId (UUID)
        const updatedClient = await this.clientDatabase.resetPassword(client.clientId, hashedPassword);
        
        // Handle case where changePassword returns null
        if (!updatedClient) {
            throw new Error('Failed to update password. Client may no longer exist.');
        }
        
        // Clean up the reset token
        await this.tokenService.deleteResetToken(email, token);
        
        return updatedClient;
    }
}