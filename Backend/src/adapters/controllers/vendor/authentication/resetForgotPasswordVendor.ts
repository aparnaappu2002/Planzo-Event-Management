import { Request, Response } from "express";
import { IresetPasswordVendorUseCase } from "../../../../domain/interfaces/useCaseInterfaces/vendor/authentication/forgotPasswordVendorUseCase";
import { HttpStatus } from "../../../../domain/entities/httpStatus";

export class ResetPasswordVendor {
    private resetPasswordVendorUseCase: IresetPasswordVendorUseCase;
    
    constructor(resetPasswordVendorUseCase: IresetPasswordVendorUseCase) {
        this.resetPasswordVendorUseCase = resetPasswordVendorUseCase;
    }
    
    async handleResetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, newPassword, token } = req.body;
            const updatedVendor = await this.resetPasswordVendorUseCase.resetPassword(email, newPassword, token);
            res.status(HttpStatus.OK).json({
                message: "Password reset successfully",
                vendor: updatedVendor
            });
        } catch (error) {
            console.log('Error while resetting password:', error);
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Error while resetting password',
                error: error instanceof Error ? error.message : 'Error while resetting password'
            });
        }
    }
}