import {Request,Response,Router} from "express"
import { clientAuthenticationController } from "../../Inject/clientInject"
import { injectedClientLoginController,
    injectedGoogleLogincontroller,
    injectedUpdateProfileClientController,
    injectedChangeClientPasswordController,
injectedChangeProfileImageClientController,injectedSendMailForgetPasswordController,
injectedForgotPasswordClientcontroller,injectedClientLogoutController } from "../../Inject/clientInject"
import { injectedVerifyTokenAndCheckBlacklistMiddleWare,injectedTokenExpiryValidationChecking,injectedClientStatusCheckingMiddleware } from "../../Inject/serviceInject"
import { checkRoleBaseMiddleware } from "../../../adapters/middlewares/roleBaseMiddleWare"

export class clientRoute{
    public clientRoute:Router
    constructor(){
        this.clientRoute=Router()
        this.setRoute()
    }
    private setRoute(){
        this.clientRoute.post('/signup',(req:Request,res:Response)=>{
            clientAuthenticationController.sendOtp(req,res)
        })
        this.clientRoute.post('/createAccount', (req: Request, res: Response) => {
            clientAuthenticationController.register(req, res)
        })
        this.clientRoute.post('/resendOtp', (req: Request, res: Response) => {
            clientAuthenticationController.resendOtp(req, res)
        })
        this.clientRoute.post('/login', (req: Request, res: Response) => {
            injectedClientLoginController.handleLogin(req, res)
        })
        this.clientRoute.post('/googleLogin', (req: Request, res: Response) => {
            injectedGoogleLogincontroller.handleGoogleLogin(req, res)
        })
        this.clientRoute.put('/updateProfileClient',  (req: Request, res: Response) => {
            injectedUpdateProfileClientController.handleUpdateProfileClient(req, res)
        })
        this.clientRoute.patch('/changePasswordClient',  (req: Request, res: Response) => {
            injectedChangeClientPasswordController.handeChangePasswordClient(req, res)
        })
        this.clientRoute.patch('/updateProfileImage', injectedVerifyTokenAndCheckBlacklistMiddleWare,injectedTokenExpiryValidationChecking,checkRoleBaseMiddleware('client'),injectedClientStatusCheckingMiddleware, (req: Request, res: Response) => {
            injectedChangeProfileImageClientController.handleUpdateProfileImageClient(req, res)
        })
        this.clientRoute.post('/sendEmailForgetPassword', (req: Request, res: Response) => {
            injectedSendMailForgetPasswordController.handleSendResetEmail(req, res)
        })
        this.clientRoute.post('/resetforgetPassword', (req: Request, res: Response) => {
            injectedForgotPasswordClientcontroller.handleResetPassword(req, res)
        })
        this.clientRoute.post('/logout', injectedVerifyTokenAndCheckBlacklistMiddleWare, injectedTokenExpiryValidationChecking, checkRoleBaseMiddleware('client'), injectedClientStatusCheckingMiddleware, (req: Request, res: Response) => {
            injectedClientLogoutController.handleClientLogout(req, res)
        })
        
    }
}