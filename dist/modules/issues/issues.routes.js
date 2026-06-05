import { Router } from "express";
import { createIssue, deleteIssue, getIssueById, getIssues, updateIssue, } from "./issues.controller.js";
import { authenticate, authorizeRole } from "../../middleware/auth.js";
const router = Router();
router.get("/", getIssues);
router.get("/:id", getIssueById);
router.post("/", authenticate, createIssue);
router.patch("/:id", authenticate, updateIssue);
router.delete("/:id", authenticate, authorizeRole("maintainer"), deleteIssue);
export default router;
//# sourceMappingURL=issues.routes.js.map