import express,{Express,urlencoded} from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { connectMongo } from './framework/database/databaseConnection/dbConnection'
import { clientRoute } from './framework/routes/client/clientRoute'
import redisService from './framework/services/redisService'

export class App{
    private app:Express
    private database:connectMongo
    constructor(){
        dotenv.config()
        this.app=express()
        this.database=new connectMongo()
        this.database.connectDb()
        this.setMiddlewares()
        this.setClientRoute()
        this.connectRedis()

        
    }
    private setMiddlewares() {
        this.app.use(cors({
            origin: process.env.ORIGIN,
            credentials: true
        }))
        this.app.use(cookieParser())
        this.app.use(express.json())
        this.app.use(urlencoded({ extended: true }))
        this.app.use(morgan('dev'))
    }
    private async connectRedis() {
        await redisService.connect()
    }
    private setClientRoute() {
        this.app.use('/user', new clientRoute().clientRoute)
    }
    public listen() {
        const port = process.env.PORT || 3000
        this.app.listen(port, () => console.log(`server running on ${port}`))
    }
}

const app=new App()
app.listen()
