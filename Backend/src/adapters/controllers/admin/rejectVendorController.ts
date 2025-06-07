import { Request, Response } from "express";
import { IrejectVendorUseCase } from "../../../domain/interfaces/useCaseInterfaces/admin/rejectedVendorUseCaseInterface";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export class RejectVendorControllerAdmin {
    private rejectVendorUseCase: IrejectVendorUseCase;
    
    constructor(rejectVendorUseCase: IrejectVendorUseCase) {
        this.rejectVendorUseCase = rejectVendorUseCase;
    }
    
    async handleRejectVendor(req: Request, res: Response): Promise<void> {
        try {
            const { vendorId, newStatus, rejectionReason } = req.body;
            
            // Validate required fields
            if (!vendorId || !newStatus || !rejectionReason) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    message: "Missing required fields: vendorId, newStatus, and rejectionReason are required"
                });
                return;
            }
            
            const rejectedVendor = await this.rejectVendorUseCase.rejectVendor(vendorId, newStatus, rejectionReason);
            
            res.status(HttpStatus.OK).json({ 
                message: "Vendor rejected successfully",
                data: {
                    vendorId: rejectedVendor.vendorId,
                    name: rejectedVendor.name,
                    email: rejectedVendor.email,
                    status: rejectedVendor.vendorStatus,
                    rejectionReason: rejectedVendor.rejectionReason
                }
            });
        } catch (error) {
            console.log('Error while rejecting vendor:', error);
            
            // Handle specific error types
            if (error instanceof Error && error.message === 'No vendor exists') {
                res.status(HttpStatus.NOT_FOUND).json({
                    message: "Vendor not found",
                    error: error.message
                });
                return;
            }
            
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Error while rejecting vendor",
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    }
}