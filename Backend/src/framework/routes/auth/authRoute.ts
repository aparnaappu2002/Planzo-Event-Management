import { Request,Response,Router } from "express";
import { injectedRefreshTokenController } from "../../Inject/serviceInject";

export class AuthRoute {
    public AuthRouter: Router
    constructor() {
        this.AuthRouter = Router()
        this.setRoute()
    }
    private setRoute() {
        this.AuthRouter.post('/refreshToken', (req: Request, res: Response) => {
            injectedRefreshTokenController.handleRefreshToken(req, res)
        })
    }
}