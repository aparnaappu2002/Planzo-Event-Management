import { decodedTokenEntity } from "../../domain/entities/decodedTokenEntity";
import { IjwtInterface } from "../../domain/interfaces/serviceInterface/IjwtService";
import jwt from 'jsonwebtoken'
export class JwtService implements IjwtInterface {
    createAccessToken(accessSecretKey: string, userId: string, role: string): string {
        return jwt.sign({ userId, role }, accessSecretKey, { expiresIn: '15m' })
    }
    createRefreshToken(refreshSecretKey: string, userId: string): string {
        return jwt.sign({ userId }, refreshSecretKey, { expiresIn: '1d' })
    }
    verifyAccessToken(accessToken: string, accessSecretKey: string) {
        try {
            return jwt.verify(accessToken, accessSecretKey) as { userId: string, role: string }
        } catch (error) {
            return null
        }
    }
    verifyRefreshToken(refreshToken: string, refreshSecretKey: string): { userId: string; } | null {
        try {
            return jwt.verify(refreshToken, refreshSecretKey) as { userId: string }
        } catch (error) {
            return null
        }
    }
    tokenDecode(accessToken: string): decodedTokenEntity {
        return jwt.decode(accessToken) as decodedTokenEntity
    }
}