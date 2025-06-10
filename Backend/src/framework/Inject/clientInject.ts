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
import { SendResetEmailForForgetPassword } from "../../useCases/client/authentication/sendResetForgotPassword";
import { PasswordResetService } from "../services/resetEmailService";
import { TokenService } from "../services/tokenService";
import { SendResetEmailToClient } from "../../adapters/controllers/client/authentication/sendForgetPasswordEmail";
import { ResetPasswordClientUseCase } from "../../useCases/client/authentication/forgotPasswordUseCase";
import { ResetPasswordClient } from "../../adapters/controllers/client/authentication/resetForgotPassword";
import { ClientLogoutUseCase } from "../../useCases/client/authentication/clientLogoutUseCase";
import { ClientLogoutController } from "../../adapters/controllers/client/authentication/clientLogoutController";





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


//send mail for forgot password
const PasswordResetMailService=new PasswordResetService()
const ACCESSTOKEN_SECRET_KEY = process.env.ACCESSTOKEN_SECRET_KEY

const Tokenservice = new TokenService(redisService,jwtService,ACCESSTOKEN_SECRET_KEY!);
const sendMailForForgotPasswordUseCase=new SendResetEmailForForgetPassword(PasswordResetMailService,Tokenservice,ClientRepository)
export const injectedSendMailForgetPasswordController = new SendResetEmailToClient(sendMailForForgotPasswordUseCase)

//changing password for forgot password
const forgotPasswordClientUseCase=new ResetPasswordClientUseCase(Tokenservice,ClientRepository)
export const injectedForgotPasswordClientcontroller=new ResetPasswordClient(forgotPasswordClientUseCase)

//client Logout
const clientLogoutUseCase=new ClientLogoutUseCase(redisService,jwtService)
export const injectedClientLogoutController = new ClientLogoutController(clientLogoutUseCase)