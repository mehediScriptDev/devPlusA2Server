import app from "./app";
import config from "./config";
import { initializeDatabase } from "./config/db.js";
const main = async () => {
    await initializeDatabase();
    app.listen(config.port, () => {
        console.log(`see? this is my port number man: ${config.port}`);
    });
};
main();
//# sourceMappingURL=server.js.map