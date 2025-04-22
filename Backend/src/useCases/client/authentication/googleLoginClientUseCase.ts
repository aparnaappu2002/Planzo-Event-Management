import { clientEntity } from "../../../domain/entities/clientEntity";
import { IClientDatabaseRepository } from "../../../domain/interfaces/repositoryInterfaces/client/clientDatabaseRepository";
import { IgoogleLoginClientUseCase } from "../../../domain/interfaces/useCaseInterfaces/client/authentication/IgoogleLoginUsecase";
export class GoogleLoginClientUseCase implements IgoogleLoginClientUseCase {
    private clientDatabase: IClientDatabaseRepository
    constructor(clientDatabase: IClientDatabaseRepository) {
        this.clientDatabase = clientDatabase
    }
    async googleLogin(client: clientEntity): Promise<clientEntity | null> {
        const exitingUser = await this.clientDatabase.findByEmail(client.email)
        if (exitingUser) {
            if(exitingUser.status !='active') throw new Error('User Blocked by admin')
            return exitingUser
        } else {

            return await this.clientDatabase.googleLogin(client)
        }
    }
}