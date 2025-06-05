import { IresetMailService } from "../../domain/interfaces/serviceInterface/IresetMailService";
import nodemailer from "nodemailer";
import { resetPasswordEmailTemplate } from "../../templates/resetPasswordEmailTemplate";

export class PasswordResetService implements IresetMailService {
    private transporter: nodemailer.Transporter;
    
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD
            }
        });
    }

    async sendPasswordResetEmail(email: string, resetToken: string, resetUrl: string): Promise<void> {
        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: "Password Reset Request",
            html: resetPasswordEmailTemplate(resetToken, resetUrl)
        };
        
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Password reset email sent to ${email}`);
        } catch (error) {
            console.log('Error while sending password reset email:', error);
            throw new Error('Failed to send password reset email');
        }
    }
}