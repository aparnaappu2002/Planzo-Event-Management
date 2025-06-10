export interface IclientLogoutUseCase {
    clientLogout(token:string):Promise<boolean>
}