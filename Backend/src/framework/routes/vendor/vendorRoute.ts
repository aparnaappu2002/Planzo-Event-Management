import { Request,Response,Router } from "express";
import { injectedVendorAuthenticationController,injectedVendorLoginController,injectedResendOtpVendorController,
    injectedUpdateImageVendorController,injectedUpdateAboutAndPhoneController,
    injectedChangePasswordVendorController,injectedEventCreationController,injectedFindAllEventsVendorController,injectedUpdateEventController
 } from "../../Inject/vendorInject";



export class VendorRoute {
    public vendorRoute: Router
    constructor() {
        this.vendorRoute = Router()
        this.setRoute()
    }
    private setRoute() {
        this.vendorRoute.post('/signup', (req: Request, res: Response) => {
            injectedVendorAuthenticationController.sendOtp(req, res)
        })
        this.vendorRoute.post('/verify', (req: Request, res: Response) => {
            injectedVendorAuthenticationController.registerVendor(req, res)
        })
        this.vendorRoute.post('/login', (req: Request, res: Response) => {
            injectedVendorLoginController.handleLoginVendor(req, res)
        })
        this.vendorRoute.post('/resendOtp', (req: Request, res: Response) => {
            injectedResendOtpVendorController.handleResendOtp(req, res)
        })
        this.vendorRoute.post('/updateProfileImage',  (req: Request, res: Response) => {
            injectedUpdateImageVendorController.handleUpdateImageVendor(req, res)
        })
        this.vendorRoute.patch('/updateDetailsVendor',  (req: Request, res: Response) => {
            injectedUpdateAboutAndPhoneController.handleUpdateAboutAndPhone(req, res)
        })
        this.vendorRoute.patch('/changePassword', (req: Request, res: Response) => {
            injectedChangePasswordVendorController.handleChangePasswordVendor(req, res)
        })
        this.vendorRoute.post('/createEvent/:vendorId',  (req: Request, res: Response) => {
            injectedEventCreationController.handleCreateEvent(req, res)
        })
        this.vendorRoute.get('/showEvents/:pageNo/:vendorId',  (req: Request, res: Response) => {
            injectedFindAllEventsVendorController.handleFindAllEventsVendor(req, res)
        })
        this.vendorRoute.put('/updateEvent',  (req: Request, res: Response) => {
            injectedUpdateEventController.handleUpdateEvent(req, res)
        })
    }
}

