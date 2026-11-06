import { Router } from "express";
import { UserRoute } from "./user/routes/user.route";

export class FactoryRoutes {


    static get routes() {
        const route = Router()

        route.use("/users", UserRoute.routes)

        return route;

    }
}