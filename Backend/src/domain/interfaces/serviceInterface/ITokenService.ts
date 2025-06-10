import { JwtPayload } from "jsonwebtoken";

export interface ITokenService {
    generateResetToken(email: string): string;
    storeResetToken(email: string, token: string): Promise<void>;
    verifyResetToken(email: string, token: string): Promise<boolean>;
    deleteResetToken(email: string, token: string): Promise<void>;
    checkTokenBlacklist(token: string): Promise<boolean>
    verifyToken(token: string): Promise<string | JwtPayload>
}