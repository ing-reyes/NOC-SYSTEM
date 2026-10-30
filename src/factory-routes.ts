import { Router } from "express";

export class FactoryRoutes{


    static get routes(){
        const route = Router()

        route.get("/", (req, res)=>{
            return res.json({message: "HOLA MUNDO"})
        })

        route.post("/", (req, res)=>{

            
            return res.json({
                message: "POST",
                body: req.body,
            })
        })

        route.patch("/:id", (req, res)=>{

            
            return res.json({
                message: "PATH",
                body: req.body,
                id: req.params.id
            })
        })


        route.get("/:id/:id2", (req, res)=>{

            
            return res.json({
                message: "BUSQUEDA POR ID", 
                param1: req.params.id,
                param2: req.params.id2,
                query: req.query
            })
        })



        return route;
    }

}