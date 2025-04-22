import { ClientUpdateProfileEntity } from "../../../domain/entities/client/clientUpdateProfile";
import { clientEntity } from "../../../domain/entities/clientEntity";
import { IClientDatabaseRepository } from "../../../domain/interfaces/repositoryInterfaces/client/clientDatabaseRepository";
import { IupdateProfileDataUseCase } from "../../../domain/interfaces/useCaseInterfaces/client/profile/updateProfileDataUseCaseInterface";
export class UpdateProfileClientUseCase implements IupdateProfileDataUseCase {
    private clientDatabase: IClientDatabaseRepository
    constructor(clientDatabase: IClientDatabaseRepository) {
        this.clientDatabase = clientDatabase
    }
    async updateClientProfile(client: ClientUpdateProfileEntity): Promise<clientEntity | null> {
        return await this.clientDatabase.updateProfile(client)
    }
}