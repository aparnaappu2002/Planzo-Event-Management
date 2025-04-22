import { ClientUpdateProfileEntity } from "../../../../entities/client/clientUpdateProfile";
import { clientEntity } from "../../../../entities/clientEntity";
export interface IupdateProfileDataUseCase {
    updateClientProfile(client: ClientUpdateProfileEntity): Promise<clientEntity | null>
}