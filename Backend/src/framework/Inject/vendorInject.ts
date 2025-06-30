import { emailService } from "../services/emailService";
import { OtpService } from "../services/generateOtp";
import { VendorDatabase } from "../../adapters/repository/vendor/vendorDatabase";
import { clientRepository } from "../../adapters/repository/client/clientRepository";
import { userExistance } from "../services/userExistenceChecking";
import { VendorLoginUsecase } from "../../useCases/vendor/authentication/registerVendorUseCase";
import { SendOtpVendorUsecase } from "../../useCases/vendor/authentication/sendOtpVendorUseCase";
import { VendorAuthenticationController } from "../../adapters/controllers/vendor/authentication/registerVendor";
import { ResendOtpVendorUsecase } from "../../useCases/vendor/authentication/resendOtpVendorUseCase";
import { ResendOtpVendorController } from "../../adapters/controllers/vendor/authentication/resendOtpController";
import { LoginVendorUseCase } from "../../useCases/vendor/authentication/loginVendorUseCase";
import { JwtService } from "../services/jwtService";
import { RedisService } from "../services/redisService";
import { LoginVendorController } from "../../adapters/controllers/vendor/authentication/loginVendorController";
import { ProfileImageUpdateUseCase } from "../../useCases/vendor/profile/profileImageUpdate";
import { UpdateImageVendorController } from "../../adapters/controllers/vendor/profile/updateImageController";
import { UpdateAboutAndPhoneVendorController } from "../../adapters/controllers/vendor/profile/updateProfileDetails";
import { updateAboutAndPhoneUseCase } from "../../useCases/vendor/profile/updateVendorProfile";
import { ChangePasswordVendorControler } from "../../adapters/controllers/vendor/profile/changePasswordVendorController";
import { ChangePasswordVendorUseCase } from "../../useCases/vendor/profile/changePassword";
import { hashPassword } from "../hashPassword/hashPassword";
import { EventRepository } from "../../adapters/repository/event/eventRepository";
import { EventCreationUseCase } from "../../useCases/vendor/event/eventCreationUseCase";
import { EventCreationController } from "../../adapters/controllers/vendor/event/eventCreateController";
import { FindAllEventsVendorUseCase } from "../../useCases/vendor/event/findAllEventsUseCase";
import { FindAllEventsVendorController } from "../../adapters/controllers/vendor/event/findAllEventsController";
import { UpdateEventUseCase } from "../../useCases/vendor/event/updateEventUseCase";
import { UpdateEventController } from "../../adapters/controllers/vendor/event/updateEventController";
import { VendorLogoutUseCase } from "../../useCases/vendor/authentication/vendorLogoutUseCase";
import { VendorLogoutController } from "../../adapters/controllers/vendor/authentication/vendorLogoutController";
import { ReapplyVendorUseCase } from "../../useCases/vendor/authentication/reapplyVendorUseCase";
import { ReapplyVendorController } from "../../adapters/controllers/vendor/authentication/reapplyVendorController";
import { SendResetEmailForForgetPasswordVendor } from "../../useCases/vendor/authentication/sendResetForgotPasswordVendor";
import { SendResetEmailToVendor } from "../../adapters/controllers/vendor/authentication/sendForgetPasswordVendor";
import { PasswordResetService } from "../services/resetEmailService";
import { TokenService } from "../services/tokenService";
import { ResetPasswordVendorUseCase } from "../../useCases/vendor/authentication/forgotPasswordVendorUseCase";
import { ResetPasswordVendor } from "../../adapters/controllers/vendor/authentication/resetForgotPasswordVendor";



//Register Vendor
const EmailService = new emailService()
const otpService = new OtpService()
const vendorRespository = new VendorDatabase()
const clientDatabase = new clientRepository()
const UserExistance = new userExistance(clientDatabase, vendorRespository)
const injectedVendorUseCase = new VendorLoginUsecase(vendorRespository)
const sendOtpVendorUsecase = new SendOtpVendorUsecase(EmailService, otpService, UserExistance)
export const injectedVendorAuthenticationController = new VendorAuthenticationController(injectedVendorUseCase, sendOtpVendorUsecase)
//Resend Otp
const resendOtpVendorUseCase = new ResendOtpVendorUsecase(EmailService, otpService)
export const injectedResendOtpVendorController = new ResendOtpVendorController(resendOtpVendorUseCase)
//Login Vendor
const vendorLoginUseCase = new LoginVendorUseCase(vendorRespository)
const jwtService = new JwtService()
const redisService = new RedisService()
export const injectedVendorLoginController = new LoginVendorController(vendorLoginUseCase, jwtService, redisService)
//update profile image of vendor
const updateImageVendorUseCase = new ProfileImageUpdateUseCase(vendorRespository)
export const injectedUpdateImageVendorController = new UpdateImageVendorController(updateImageVendorUseCase)
//update vedor details
const UpdateAboutAndPhoneUseCase = new updateAboutAndPhoneUseCase(vendorRespository)
export const injectedUpdateAboutAndPhoneController = new UpdateAboutAndPhoneVendorController(UpdateAboutAndPhoneUseCase)

//change password
const HashPassword = new hashPassword()
const changePasswordUseCase = new ChangePasswordVendorUseCase(vendorRespository, HashPassword)
export const injectedChangePasswordVendorController = new ChangePasswordVendorControler(changePasswordUseCase)

//vendor logout
const vendorLogoutUseCase = new VendorLogoutUseCase(redisService,jwtService)
export const injectedVendorLogoutController = new VendorLogoutController(vendorLogoutUseCase)
//create event
const eventRepository = new EventRepository()
const eventCreationUseCase = new EventCreationUseCase(eventRepository)
export const injectedEventCreationController = new EventCreationController(eventCreationUseCase)
//find all events
const findAllEventsVendorUseCase = new FindAllEventsVendorUseCase(eventRepository)
export const injectedFindAllEventsVendorController = new FindAllEventsVendorController(findAllEventsVendorUseCase)
//update event
const updateEventUseCase = new UpdateEventUseCase(eventRepository)
export const injectedUpdateEventController = new UpdateEventController(updateEventUseCase)

//Reapply Vendor

const reApplyVendorUseCase=new ReapplyVendorUseCase(vendorRespository)
export const injectedReapplyVendorController = new ReapplyVendorController(reApplyVendorUseCase)

//send Mail for forgot Password

const PasswordResetMailService=new PasswordResetService()
const ACCESSTOKEN_SECRET_KEY=process.env.ACCESSTOKEN_SECRET_KEY
const Tokenservice=new TokenService(redisService,jwtService,ACCESSTOKEN_SECRET_KEY!)
const sendMailForForgotPasswordVendorUseCase=new SendResetEmailForForgetPasswordVendor(PasswordResetMailService,Tokenservice,vendorRespository)
export const injectedSendMailForgotPasswordVendorController=new SendResetEmailToVendor(sendMailForForgotPasswordVendorUseCase)

//changing password in forgot password
const forgotPasswordVendorUseCase=new ResetPasswordVendorUseCase(Tokenservice,vendorRespository)
export const injectedForgotPasswordVendorController=new ResetPasswordVendor(forgotPasswordVendorUseCase)