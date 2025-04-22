import { OtpService } from "../services/generateOtp";
import { emailService } from "../services/emailService";
import { CreateClientUseCase } from "../../useCases/client/authentication/createClientUsecase";
import { clientRepository } from "../../adapters/repository/client/clientRepository";
import { ClientAuthenticationController } from "../../adapters/controllers/client/authentication/clientAuthenticationController";
import { sendOtpClientUseCase } from "../../useCases/client/authentication/sendOtpClientUseCase";
import { userExistance } from "../services/userExistenceChecking";
import {VendorDatabase} from "../../adapters/repository/vendor/vendorDatabase"
import { JwtService } from "../services/jwtService";
import { RedisService } from "../services/redisService";
import { LoginClientUseCase } from "../../useCases/client/authentication/loginClientUseCase";
import { ClientLoginController } from "../../adapters/controllers/client/authentication/clientLoginController";
import { GoogleLoginClient } from "../../adapters/controllers/client/authentication/clientGoogleLogin";
import { GoogleLoginClientUseCase } from "../../useCases/client/authentication/googleLoginClientUseCase";
import { UpdateProfileClientUseCase } from "../../useCases/client/profile/updateProfileDataClientUseCase";
import { UpdateProfileClientController } from "../../adapters/controllers/client/profile/updateProfileClientController";
import { hashPassword } from "../hashPassword/hashPassword";
import { ChangePasswordClientUseCase } from "../../useCases/client/profile/changePasswordClientUseCase";
import { ChangePasswordClientController } from "../../adapters/controllers/client/profile/changePasswordClientController";
import { ChangeProfileImageClientUseCase } from "../../useCases/client/profile/changeProfileImageUseCase";
import { ChangeProfileImageClientController } from "../../adapters/controllers/client/profile/changeProfileImageClientController";






//Signup
const otpService=new OtpService()
const EmailService=new emailService()
const ClientRepository = new clientRepository()
const vendorDatabase = new VendorDatabase()
const userExistence=new userExistance(ClientRepository,vendorDatabase)
const SendOtpClientUseCase = new sendOtpClientUseCase(otpService, EmailService,userExistence)
const createClientUseCase = new CreateClientUseCase(ClientRepository)
export const clientAuthenticationController = new ClientAuthenticationController(createClientUseCase, SendOtpClientUseCase)
//Login

const jwtService=new JwtService()
const redisService=new RedisService()
const loginClientUseCase=new LoginClientUseCase(ClientRepository)
export const injectedClientLoginController=new ClientLoginController(loginClientUseCase,jwtService,redisService)

//googleLogin
const googleLoginClientUseCase = new GoogleLoginClientUseCase(ClientRepository)
export const injectedGoogleLogincontroller = new GoogleLoginClient(googleLoginClientUseCase, jwtService, redisService)
//update client profile data
const updateProfileClientUseCase = new UpdateProfileClientUseCase(ClientRepository)
export const injectedUpdateProfileClientController = new UpdateProfileClientController(updateProfileClientUseCase)
//client password change

const HashPassword = new hashPassword()
const changeClientPasswordUseCase = new ChangePasswordClientUseCase(ClientRepository, HashPassword)
export const injectedChangeClientPasswordController = new ChangePasswordClientController(changeClientPasswordUseCase)

//update profile image
const changeProfileImageClientUseCase = new ChangeProfileImageClientUseCase(ClientRepository)
export const injectedChangeProfileImageClientController = new ChangeProfileImageClientController(changeProfileImageClientUseCase)