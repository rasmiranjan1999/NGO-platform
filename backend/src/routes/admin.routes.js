import express from "express";

import {
  createAdmin,
  getAdmins,
  deleteAdmin,
} from "../controllers/admin.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("super_admin"),
  createAdmin
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("super_admin"),
  getAdmins
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("super_admin"),
  deleteAdmin
);

export default router;