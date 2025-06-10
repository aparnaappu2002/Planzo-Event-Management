import { NextFunction,Request,Response } from "express";
import { IjwtInterface } from "../../domain/interfaces/serviceInterface/IjwtService";
import { IredisService } from "../../domain/interfaces/serviceInterface/IredisService";
import { IadminRepository } from "../../domain/interfaces/repositoryInterfaces/admin/IadminDatabaseRepoInterface";
import { HttpStatus } from "../../domain/entities/httpStatus";

export const checkAdminState = (jwtService: IjwtInterface, redisService: IredisService, adminDatabase: IadminRepository) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const status = await redisService.get('adminRole')
        console.log('this is admin status',status)
        const user = (req as any).user
        const userId = user.userId
        console.log('this is user', user)
        if (status && status !== 'true') {
            res.status(HttpStatus.FORBIDDEN).json({ error: "UnAuthorized" })
            return
        }
        if (!status) {
            const status = await adminDatabase.findState(userId)
            console.log('status of admin from database',status)
            if (status !== true) {
                res.status(HttpStatus.FORBIDDEN).json({ error: "UnAuthorized" })
                return
            }
            await redisService.set('adminRole', 15 * 60, `${status}`)
        }
        next()
    }
}