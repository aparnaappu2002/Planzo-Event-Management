export interface IresetMailService {
    sendPasswordResetEmail(email: string, resetToken: string, resetUrl: string): Promise<void>;
}