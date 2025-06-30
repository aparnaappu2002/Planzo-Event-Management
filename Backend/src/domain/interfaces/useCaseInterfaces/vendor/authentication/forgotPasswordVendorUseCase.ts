
import { VendorEntity } from "../../../../entities/vendorEntity";

export interface IresetPasswordVendorUseCase {
    resetPassword(email: string, newPassword: string, token: string): Promise<VendorEntity>;
}