import express from "express";

import {
  getSettings,
  updateSettings,
} from "../controllers/settings.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

router.get("/", getSettings);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

router.put(
  "/",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  updateSettings
);

export default router;