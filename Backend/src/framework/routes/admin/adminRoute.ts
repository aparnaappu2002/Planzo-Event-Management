import { Request,Response,Router } from "express";
import { injectedAdminLoginController,injectedFindAllClientController,
    injectedBlockClientController,injectedClientUnblockController,
injectedFindAllVendorController,injectedFindAllPendingVendorController,
injectedRejectVendorController,injectedApproveVendorStatus,
injectedVendorBlockController,injectedVendorUnblockController,
injectedFindAllRejectedVendorController
    
 } from "../../Inject/adminInject";

export class AdminRoute {
    public adminRoute: Router
    constructor() {
        this.adminRoute = Router()
        this.setRoute()
    }
    private setRoute() {
        this.adminRoute.post('/login', (req: Request, res: Response) => {
            injectedAdminLoginController.handleAdminLogin(req, res)
        })
        this.adminRoute.get('/clients', (req: Request, res: Response) => {
            injectedFindAllClientController.findAllClient(req, res)
        })
        this.adminRoute.patch('/blockClient',  (req: Request, res: Response) => {
            injectedBlockClientController.handleClientBlock(req, res)
        })
        this.adminRoute.patch('/unblockClient',  (req: Request, res: Response) => {
            injectedClientUnblockController.handleClientUnblock(req, res)
        })
        this.adminRoute.get('/vendors',  (req: Request, res: Response) => {
            injectedFindAllVendorController.findAllVendor(req, res)
        })
        this.adminRoute.get('/pendingVendors',  (req: Request, res: Response) => {
            injectedFindAllPendingVendorController.findPendingVendor(req, res)
        })
        this.adminRoute.get('/rejectedVendors',  (req: Request, res: Response) => {
            injectedFindAllRejectedVendorController.handleFindAllRejectedVendor(req, res)
        })
        this.adminRoute.patch('/updateVendorStatus',  (req: Request, res: Response) => {
            injectedApproveVendorStatus.handleApproveVendorUseCase(req, res)
        })
        this.adminRoute.patch('/rejectVendor',  (req: Request, res: Response) => {
            injectedRejectVendorController.handleRejectVendor(req, res)
        })
        this.adminRoute.patch('/blockVendor',  (req: Request, res: Response) => {
            injectedVendorBlockController.handleVendorBlock(req, res)
        })
        this.adminRoute.patch('/unblockVendor', (req: Request, res: Response) => {
            injectedVendorUnblockController.handleVendorUnblock(req, res)
        })
        
    }
}