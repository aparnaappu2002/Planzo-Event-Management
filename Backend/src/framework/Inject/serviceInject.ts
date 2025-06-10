import { RedisService } from "../services/redisService";
import { JwtService } from "../services/jwtService";
import { TokenService } from "../services/tokenService";
import { verifyTokenAndCheckBlackList } from "../../adapters/middlewares/tokenValidationMiddleWare";
import { clientRepository } from "../../adapters/repository/client/clientRepository";
import { VendorDatabase } from "../../adapters/repository/vendor/vendorDatabase";
import { AdminRepository } from "../../adapters/repository/admin/adminRepository";
import { RefreshTokenUseCase } from "../../useCases/auth/refreshTokenuseCase";
import { RefreshTokenController } from "../../adapters/controllers/auth/refreshTokenController";
import { tokenTimeExpiryValidationMiddleware } from "../../adapters/middlewares/tokenTimeExpiryMIddleWare";
import { checkAdminState } from "../../adapters/middlewares/checkAdmin";
import { clientStatusCheckingMiddleware } from "../../adapters/middlewares/client/clientMiddleware";
import { vendorStatusCheckingMiddleware } from "../../adapters/middlewares/vendor/vendorStatusCheckingMiddleware";







const redisService=new RedisService()
const jwtService=new  JwtService()
const ACCESSTOKEN_SECRET_KEY = process.env.ACCESSTOKEN_SECRET_KEY
const tokenService=new TokenService(redisService,jwtService,ACCESSTOKEN_SECRET_KEY!)


export const injectedVerifyTokenAndCheckBlacklistMiddleWare=verifyTokenAndCheckBlackList(tokenService)

//Refresh Token Service

const clientDatabase=new clientRepository()
const vendorDatabase=new VendorDatabase()
const adminRespository=new AdminRepository()
const refreshTokenUseCase = new RefreshTokenUseCase(jwtService,clientDatabase,vendorDatabase,adminRespository)
export const injectedRefreshTokenController = new RefreshTokenController(refreshTokenUseCase)

//token expiry validation checking middleware
export const injectedTokenExpiryValidationChecking=tokenTimeExpiryValidationMiddleware(jwtService)
export const checkAdminMiddleWare = checkAdminState(jwtService,redisService,adminRespository)

//client status checking middleware

const ClientRepository = new clientRepository()
export const injectedClientStatusCheckingMiddleware = clientStatusCheckingMiddleware(redisService,ClientRepository)

//vendor status checking middleware
export const injectedVendorStatusCheckingMiddleware = vendorStatusCheckingMiddleware(redisService,vendorDatabase)



