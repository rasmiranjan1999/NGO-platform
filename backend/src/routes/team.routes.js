import express from "express";

import {
  createTeamMember,
  getTeamMembers,
  updateTeamMember,
  deleteTeamMember
} from "../controllers/team.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

router.get("/", getTeamMembers);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  createTeamMember
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  updateTeamMember
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  deleteTeamMember
);

export default router;