
export interface IsendForForgetPasswordClient {
    sendOtpForForgetPassword(email: string): Promise<void>;
}