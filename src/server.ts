import express from "express";
import { FactoryRoutes } from "./factory-routes";

export class AppServer {


    private app = express();

    run(){
       
        //1. Middlewares
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));



        //2. Routes
        this.app.use("/",  FactoryRoutes.routes  )


        //3. Listen
        this.app.listen(3000, ()=>{
            console.log("Server running on port 3000")
        })
    }


}