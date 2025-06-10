import { NextFunction,Request,Response } from "express";
import { ITokenService } from "../../domain/interfaces/serviceInterface/ITokenService";
import { HttpStatus } from "../../domain/entities/httpStatus";

export const verifyTokenAndCheckBlackList = (TokenService: ITokenService) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Access denied. No token provided.' });
            return
        }
        const token = authHeader.split(' ')[1]
        try {
            const isBlacklisted = await TokenService.checkTokenBlacklist(token)
            if (isBlacklisted) {
                res.status(HttpStatus.FORBIDDEN).json({ message: "This token is blacklisted", error: "This token is blacklisted" })
                return
            }
            const decoded = await TokenService.verifyToken(token);
            (req as any).user = decoded;
            next()
        } catch (error) {
            res.status(HttpStatus.FORBIDDEN).json({ message: 'Invalid token.', error: error instanceof Error ? error.message : 'invalid Token' });

        }
    }
}