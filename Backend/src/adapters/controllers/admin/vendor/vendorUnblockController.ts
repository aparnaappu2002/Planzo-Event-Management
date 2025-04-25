import { Request,Response } from "express";
import { IvendorUnblockUsecase } from "../../../../domain/interfaces/useCaseInterfaces/admin/vendorManagement/vendorUnBlockUseCaseInterface";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { IredisService } from "../../../../domain/interfaces/serviceInterface/IredisService";
export class VendorUnblockController {
    private vendorUnblockUseCase: IvendorUnblockUsecase
    private redisService: IredisService
    constructor(vendorUnblockUseCase: IvendorUnblockUsecase, redisService: IredisService) {
        this.vendorUnblockUseCase = vendorUnblockUseCase
        this.redisService = redisService
    }
    async handleVendorUnblock(req: Request, res: Response): Promise<void> {
        try {
            const { vendorId } = req.body
            const unblockUser = await this.vendorUnblockUseCase.vendorUnblock(vendorId)
            const changeStatusInRedis = await this.redisService.set(`user:vendor:${vendorId}`, 15 * 60, JSON.stringify({ status: 'active', vendorStatus: 'approved' }))
            if (unblockUser) res.status(HttpStatus.OK).json({ message: "Vendor Unblocked" })
        } catch (error) {
            console.log('error while unblocking vendor', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "error while unblocking vendor",
                error: error instanceof Error ? error.message : "error while unblocking vendor"
            })
        }
    }
}