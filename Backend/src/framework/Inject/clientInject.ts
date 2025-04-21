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
