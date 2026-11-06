import { Router } from "express";
import { UsersController } from "../controllers/user.controller";
import { UsersService } from "../services/user.service";

export class UserRoute {


    static get routes() {
        const route = Router()
        const usersService = new UsersService()
        const usersController = new UsersController(usersService)

        route.post("/", usersController.create)
        route.patch("/:id", usersController.update)
        route.delete("/:id", usersController.delete)
        route.get("/", usersController.findAll)
        route.get("/:id", usersController.findOne)


        return route;
    }

}