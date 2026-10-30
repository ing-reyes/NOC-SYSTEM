import { AppServer } from "./server";






function boostrap(){
    const server = new AppServer();
    server.run();
}

boostrap();