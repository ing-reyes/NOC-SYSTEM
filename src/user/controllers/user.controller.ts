import { Request, Response } from "express";
import { UsersService } from "../services/user.service";
import { logger } from "../../common/loggers/logger";

export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    create = async (req: Request, res: Response) => {
        this.usersService.create()
            .then((user) => res.json(user))
            .catch((err) => res.json({ error: "ERROR INESPERADO, VERIFIQUE LOS LOGS DEL SISTEMA" }))

    }

    update = (req: Request, res: Response) => {
        this.usersService.update()
            .then((user) => res.json(user))
            .catch((err) => res.json({ error: "ERROR INESPERADO, VERIFIQUE LOS LOGS DEL SISTEMA" }))
    }

    delete = (req: Request, res: Response) => {
        this.usersService.delete()
            .then((user) => res.json(user))
            .catch((err) => res.json({ error: "ERROR INESPERADO, VERIFIQUE LOS LOGS DEL SISTEMA" }))
    }

    findOne = (req: Request, res: Response) => {
        this.usersService.findOne()
            .then((user) => res.json(user))
            .catch((err) => res.json({ error: "ERROR INESPERADO, VERIFIQUE LOS LOGS DEL SISTEMA" }))
    }

    findAll = (req: Request, res: Response) => {
        this.usersService.findAll()
            .then((user) => res.json(user))
            .catch((err) => res.json({ error: "ERROR INESPERADO, VERIFIQUE LOS LOGS DEL SISTEMA" }))
    }


}