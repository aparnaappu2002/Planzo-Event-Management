import { VendorEntity } from "../../../domain/entities/vendorEntity";
import { IvendorDatabaseRepositoryInterface } from "../../../domain/interfaces/repositoryInterfaces/vendor/vendorDatabaseRepository";
import { IloginVendorUseCase } from "../../../domain/interfaces/useCaseInterfaces/vendor/authentication/loginVendorUseCaseInterface";
import { hashPassword } from "../../../framework/hashPassword/hashPassword";
export class LoginVendorUseCase implements IloginVendorUseCase {
    private vendorDatabase: IvendorDatabaseRepositoryInterface
    private hashpasswordService: hashPassword
    constructor(vendorDatabase: IvendorDatabaseRepositoryInterface) {
        this.vendorDatabase = vendorDatabase
        this.hashpasswordService = new hashPassword()
    }
    async loginVendor(email: string, password: string): Promise<VendorEntity | null> {
        const vendor = await this.vendorDatabase.findByEmail(email)
        if (!vendor) throw new Error('No vendor exists in this email')
            if(vendor.status == 'block') throw new Error('you are blocked by admin')
        const verifyPassword = await this.hashpasswordService.comparePassword(password, vendor.password)
        if (!verifyPassword) throw new Error('invalid password')
        return vendor
    }
}