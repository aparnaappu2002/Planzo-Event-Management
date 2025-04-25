import { IClientDatabaseRepository } from "../../../domain/interfaces/repositoryInterfaces/client/clientDatabaseRepository";
import { IclientBlockUseCase } from "../../../domain/interfaces/useCaseInterfaces/admin/clientManagement/clientBlockUsecaseInterface";
export class BlockClientUseCase implements IclientBlockUseCase {
    private clientDatabase: IClientDatabaseRepository
    constructor(clientDatabase: IClientDatabaseRepository) {
        this.clientDatabase = clientDatabase
    }
    async blockClient(clientId: string): Promise<boolean> {
        const blockedClient = await this.clientDatabase.blockUser(clientId)
        if (!blockedClient) throw new Error('No client found in this email')
        return true
    }
}