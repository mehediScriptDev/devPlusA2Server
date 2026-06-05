import app from "./app";
import config from "./config";
import { initializeDatabase } from "./config/db.js";

const startServer = async () => {
    await initializeDatabase();
    app.listen(config.port, () => {
        console.log(`Server listening on port ${config.port}`);
    });
};

if (process.env.VERCEL !== "1") {
    startServer().catch((error) => {
        console.error("Failed to start server:", error);
        process.exit(1);
    });
} else {
    initializeDatabase().catch((error) => {
        console.error("Database initialization failed:", error);
    });
}

export default app;