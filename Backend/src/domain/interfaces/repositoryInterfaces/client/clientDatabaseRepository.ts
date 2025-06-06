import { clientEntity } from "../../../entities/clientEntity";
import { ClientUpdateProfileEntity } from "../../../entities/client/clientUpdateProfile";
export interface IClientDatabaseRepository {
    createClient(client: clientEntity): Promise<clientEntity | null>
    findByEmail(email: string): Promise<clientEntity | null>
    findAllClients(pageNo: number): Promise<{ clients: clientEntity[]; totalPages: number }>
    googleLogin(client: clientEntity): Promise<clientEntity | null>
    forgotPassword(email: string, newPassword: string): Promise<clientEntity | null>
    resetPassword(clientId: string, password: string): Promise<clientEntity | null>
    findById(id: string): Promise<clientEntity | null>
    changeProfileImage(clientId: string, profileImage: string): Promise<clientEntity | null>
    showProfileDetails(cliendId: string): Promise<clientEntity | null>
    updateProfile(client: ClientUpdateProfileEntity): Promise<clientEntity | null>
    findPassword(clientId: string): Promise<string | null>
    changePassword(clientId: string, password: string): Promise<clientEntity | null>
    findStatusForMiddleware(clientId: string): Promise<string>
    blockUser(clientId: string): Promise<string | null>
    unblockUser(clientId: string): Promise<string | null>
}