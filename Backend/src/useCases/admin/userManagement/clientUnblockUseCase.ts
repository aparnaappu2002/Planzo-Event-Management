import { IClientDatabaseRepository } from "../../../domain/interfaces/repositoryInterfaces/client/clientDatabaseRepository";
import { IclientUnblockUseCase } from "../../../domain/interfaces/useCaseInterfaces/admin/clientManagement/cilentUnBlockUsecaseInterface";
export class ClientUnblockUseCase implements IclientUnblockUseCase {
    private cilentDatabase: IClientDatabaseRepository
    constructor(cilentDatabase: IClientDatabaseRepository) {
        this.cilentDatabase = cilentDatabase
    }
    async unblockClient(clientId: string): Promise<boolean> {
        const unblockedClient = await this.cilentDatabase.unblockUser(clientId)
        if (!unblockedClient) throw new Error('There is not client in this ID')
        return true
    }
}