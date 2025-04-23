import { IemailService } from "../../../domain/interfaces/serviceInterface/IemalService";
import { IotpService } from "../../../domain/interfaces/serviceInterface/IotpInterface";
import { IuserExistenceService } from "../../../domain/interfaces/serviceInterface/IuserExistenceService";
import { IsendOtpVendorInterface } from "../../../domain/interfaces/useCaseInterfaces/vendor/authentication/sendOtpVendorUseCase";
export class SendOtpVendorUsecase implements IsendOtpVendorInterface {
    private emailService: IemailService
    private otpService: IotpService
    private userExistance:IuserExistenceService
    constructor(emailService: IemailService, otpService: IotpService,userExistance:IuserExistenceService) {
        this.emailService = emailService
        this.otpService = otpService
        this.userExistance=userExistance
    }
    async execute(email: string): Promise<void> {
        const exitingEmail=await this.userExistance.emailExits(email)
        if(exitingEmail){
            throw new Error('This email is already exists')
            
        }
        const otp = this.otpService.genarateOtp()
        await this.otpService.storeOtp(email, otp)
        const sendEmail = this.emailService.sendEmailOtp(email, otp)
    }
    async verifyOtp(email: string, enteredOtp: string): Promise<boolean> {
        const otpverification = await this.otpService.verifyOtp(email, enteredOtp)
        return otpverification
    }
    async resendOtp(email: string): Promise<void> {
        const otp = this.otpService.genarateOtp()
        await this.otpService.storeOtp(email, otp)
        const sendEmail = this.emailService.sendEmailOtp(email, otp)
    }
}