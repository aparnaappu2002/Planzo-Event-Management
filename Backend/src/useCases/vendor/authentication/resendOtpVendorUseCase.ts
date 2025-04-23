import { IemailService } from "../../../domain/interfaces/serviceInterface/IemalService";
import { IotpService } from "../../../domain/interfaces/serviceInterface/IotpInterface";
import { IresendOtpVendorUsecase } from "../../../domain/interfaces/useCaseInterfaces/vendor/authentication/resendOtpVendorUseCase";
export class ResendOtpVendorUsecase implements IresendOtpVendorUsecase {
    private emailService: IemailService
    private otpService: IotpService
    constructor(emailService: IemailService, otpService: IotpService) {
        this.emailService = emailService
        this.otpService = otpService
    }
    async resendOtp(email: string): Promise<void> {
        const otp=this.otpService.genarateOtp()
        await this.otpService.storeOtp(email,otp)
        await this.emailService.sendEmailOtp(email,otp)
    }
}