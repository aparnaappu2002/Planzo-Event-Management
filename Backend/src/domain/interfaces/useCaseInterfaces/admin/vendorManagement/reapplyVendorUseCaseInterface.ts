import { VendorEntity } from "../../../../entities/vendorEntity";

export interface IreapplyVendorUseCase {
    reapplyVendor(vendorId: string, newStatus: string): Promise<VendorEntity>;
}