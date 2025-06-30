export interface IsendForForgetPasswordVendor {
    sendMailForForgetPassword(email: string): Promise<void>;
}