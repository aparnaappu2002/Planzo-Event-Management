export interface IRejectVendorEmailService {
    sendVendorRejectionEmail(email: string, vendorName: string, reason: string): Promise<void>;
}