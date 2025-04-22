import { clientEntity } from "../../../domain/entities/clientEntity";
import { IClientDatabaseRepository } from "../../../domain/interfaces/repositoryInterfaces/client/clientDatabaseRepository";
import { IhashPassword } from "../../../domain/interfaces/serviceInterface/IhashPassword";
import { IchangePasswordClientUseCAse } from "../../../domain/interfaces/useCaseInterfaces/client/profile/changePassowordClientUseCase";
import { hashPassword } from "../../../framework/hashPassword/hashPassword";
export class ChangePasswordClientUseCase implements IchangePasswordClientUseCAse {
    private clientDatabase: IClientDatabaseRepository
    private hashPassword: IhashPassword
    constructor(clientDatabase: IClientDatabaseRepository, hashPassword: IhashPassword) {
        this.hashPassword = hashPassword
        this.clientDatabase = clientDatabase
    }
    async changePasswordClient(clientId: string, Oldpassword: string, newPassword: string): Promise<clientEntity | null> {
        const clientOldPassword = await this.clientDatabase.findPassword(clientId)
        if (!clientOldPassword) throw new Error('No user Found in this ID')
        const ComparedPassword = await this.hashPassword.comparePassword(Oldpassword, clientOldPassword)
        if (!ComparedPassword) throw new Error('Old password not correct')
        const checkingOldPasswordIsSameAsNew = await this.hashPassword.comparePassword(newPassword, clientOldPassword)
        if(checkingOldPasswordIsSameAsNew) throw new Error("Cant use Old password as new again")
        const hashedPassword = await this.hashPassword.hashPassword(newPassword)
        if (!hashPassword) throw new Error('Error whiw hashing password')
        return await this.clientDatabase.changePassword(clientId, hashedPassword)

    }
}