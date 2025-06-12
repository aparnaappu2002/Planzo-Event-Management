import { Request, Response } from "express";
import { IreapplyVendorUseCase } from "../../../../domain/interfaces/useCaseInterfaces/admin/vendorManagement/reapplyVendorUseCaseInterface";
import { HttpStatus } from "../../../../domain/entities/httpStatus";

enum VendorStatus {
    Pending = 'pending'
}

export class ReapplyVendorController {
    private reapplyVendorUseCase: IreapplyVendorUseCase
    constructor(reapplyVendorUseCase: IreapplyVendorUseCase) {
        this.reapplyVendorUseCase = reapplyVendorUseCase
    }
    async handleReapplyVendorUseCase(req: Request, res: Response): Promise<void> {
        try {
            console.log(req.body)
            const { vendorId, newStatus }: { vendorId: string, newStatus: VendorStatus } = req.body
            const updatedVendor = await this.reapplyVendorUseCase.reapplyVendor(vendorId, newStatus)
            if (!updatedVendor) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: 'error while reapplying vendor' })
                return
            }
            res.status(HttpStatus.OK).json({message:`Vendor reapplied successfully`,updatedVendor})

        } catch (error) {
            console.log('error while reapplying vendor controller', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "error while reapplying vendor",
                error: error instanceof Error ? error.message : 'error while reapplying vendor'
            })
        }
    }
}