import express, { type Application } from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import issueRoutes from "./modules/issues/issues.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found", errors: null });
});

app.use(errorHandler);

export default app;