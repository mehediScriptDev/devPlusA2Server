import app from "./app"
import config from "./config";

const main = () =>{
    app.listen(config.port,()=>{
        console.log(`see? this is my port number man: ${config.port}`);
        
    })
}
main();