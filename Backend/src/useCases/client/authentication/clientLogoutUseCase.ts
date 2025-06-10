import { IjwtInterface } from "../../../domain/interfaces/serviceInterface/IjwtService";
import { IredisService } from "../../../domain/interfaces/serviceInterface/IredisService";
import { IclientLogoutUseCase } from "../../../domain/interfaces/useCaseInterfaces/client/authentication/clientLogoutUseCase";

export class ClientLogoutUseCase implements IclientLogoutUseCase {
    private redisService: IredisService
    private jwtService: IjwtInterface
    constructor(redisService: IredisService, jwtService: IjwtInterface) {
        this.redisService = redisService
        this.jwtService = jwtService
    }
    async clientLogout(token: string): Promise<boolean> {
        const decode = this.jwtService.tokenDecode(token)
        const exp = decode?.exp
        console.log(exp)
        if (!exp) throw new Error('Invalid Token')
        const currentTime = Math.floor(Date.now() / 1000);
        const ttl = exp - currentTime;
        console.log(ttl)
        if (ttl > 0) {
            await this.redisService.set(`blacklist:${token}`, ttl, 'true')
            return true
        }
        return false
    }
}