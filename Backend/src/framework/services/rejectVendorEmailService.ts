import { IRejectVendorEmailService } from "../../domain/interfaces/serviceInterface/IrejectVendorEmailService";
import nodemailer from "nodemailer";
import { vendorRejectionEmailTemplate } from "../../templates/rejectVendorTemplate";

export class RejectVendorEmailService implements IRejectVendorEmailService {
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

    async sendVendorRejectionEmail(email: string, vendorName: string, reason: string): Promise<void> {
        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: "Vendor Application Status - Planzo",
            html: vendorRejectionEmailTemplate(email, vendorName, reason)
        };
        
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Vendor rejection email sent to ${email}`);
        } catch (error) {
            console.log('Error while sending vendor rejection email:', error);
            throw new Error('Failed to send vendor rejection email');
        }
    }
}