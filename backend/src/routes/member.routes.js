import express from "express";

import {
  createMember,
  getMembers,
  updateMember,
  deleteMember,
  getPublicMembers,
} from "../controllers/member.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Member Routes
|--------------------------------------------------------------------------
*/

// Public route for frontend members page
router.get("/public", getPublicMembers);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  createMember
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  getMembers
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  updateMember
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  deleteMember
);

export default router;