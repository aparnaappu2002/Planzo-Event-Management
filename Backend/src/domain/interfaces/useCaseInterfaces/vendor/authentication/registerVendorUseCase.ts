import { VendorEntity } from "../../../../entities/vendorEntity";
export interface IvendorAuthenticationUseCase {
    signupVendor(vendor:VendorEntity):Promise<VendorEntity | null>
}