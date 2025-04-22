import { IemailService } from "../../../domain/interfaces/serviceInterface/IemalService";
import { IotpService } from "../../../domain/interfaces/serviceInterface/IotpInterface";
import {IuserExistenceService} from "../../../domain/interfaces/serviceInterface/IuserExistenceService"
import { IsendOtpClientInterface } from "../../../domain/interfaces/useCaseInterfaces/client/authentication/sendOtpClientInterface";
export class sendOtpClientUseCase implements IsendOtpClientInterface {
    private otpService: IotpService
    private emailService: IemailService
    private useExistance: IuserExistenceService
    constructor(otpService: IotpService, emailService: IemailService, useExistance: IuserExistenceService) {
        this.otpService = otpService
        this.emailService = emailService
        this.useExistance = useExistance
    }
    async execute(email: string): Promise<void> {
        const existingUser = await this.useExistance.emailExits(email)
        if (existingUser) throw new Error('This email is already exists')
        const otp = this.otpService.genarateOtp()
        await this.otpService.storeOtp(email, otp)
        await this.emailService.sendEmailOtp(email, otp)
    }
    async verifyOtp(email: string, enteredOtp: string): Promise<boolean> {
        const verify = await this.otpService.verifyOtp(email, enteredOtp)
        return verify
    }
    async resendOtp(email: string): Promise<void> {
        const otp = this.otpService.genarateOtp()
        await this.otpService.storeOtp(email, otp)
        await this.emailService.sendEmailOtp(email, otp)
    }
}