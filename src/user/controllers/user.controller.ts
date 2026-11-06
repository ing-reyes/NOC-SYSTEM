import { Request, Response } from "express";
import { UsersService } from "../services/user.service";
import { logger } from "../../common/loggers/logger";

export class UsersController{
    
    constructor(private readonly usersService: UsersService){}
    
    create = async (req: Request, res: Response) => {
        logger.debug("CREATE")
        // this.usersService.create()
        //     .then((user)=>res.json(user))
        //     .catch((err)=>res.json({error: "ERROR INESPERADO, VERIFIQUE LOS LOGS DEL SISTEMA"}))
        const response =  await this.usersService.create();
        return res.json(response)


    }

    update = (req: Request, res: Response) => {
        return this.usersService.update()
    }

    delete = (req: Request, res: Response) => {
        return this.usersService.delete()
    }

    findOne = (req: Request, res: Response) => {
        return this.usersService.findOne()
    }

    findAll = (req: Request, res: Response) => {
        return this.usersService.findAll()
    }


}