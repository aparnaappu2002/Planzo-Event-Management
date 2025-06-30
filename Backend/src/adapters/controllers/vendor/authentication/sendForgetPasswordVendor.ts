import { Request, Response } from "express";
import { IsendForForgetPasswordVendor } from "../../../../domain/interfaces/useCaseInterfaces/vendor/authentication/sendForgotPasswordVendorInterface";
import { HttpStatus } from "../../../../domain/entities/httpStatus";

export class SendResetEmailToVendor {
    private sendResetEmailVendorUseCase: IsendForForgetPasswordVendor;
    
    constructor(sendResetEmailVendorUseCase: IsendForForgetPasswordVendor) {
        this.sendResetEmailVendorUseCase = sendResetEmailVendorUseCase;
    }
    
    async handleSendResetEmail(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            await this.sendResetEmailVendorUseCase.sendMailForForgetPassword(email);
            res.status(HttpStatus.OK).json({
                message: "Reset email sent successfully"
            });
        } catch (error) {
            console.log('Error while sending reset email:', error);
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Error while sending reset email',
                error: error instanceof Error ? error.message : 'Error while sending reset email'
            });
        }
    }
}