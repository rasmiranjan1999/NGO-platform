import express from "express";

import {
  createActivity,
  getActivities,
  getActivityBySlug,
  updateActivity,
  deleteActivity,
} from "../controllers/activity.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

router.get("/", getActivities);
router.get("/:slug", getActivityBySlug);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  createActivity
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  updateActivity
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  deleteActivity
);

export default router;