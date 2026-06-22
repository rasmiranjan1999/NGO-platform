import express from "express";
import upload from "../middleware/upload.middleware.js";

import {
  applyVolunteer,
  getVolunteers,
  approveVolunteer,
  rejectVolunteer,
  getPublicVolunteers,
  deleteVolunteer,
} from "../controllers/volunteer.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/apply",
  upload.single("photo"),
  applyVolunteer
);

router.get(
  "/public",
  getPublicVolunteers
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  getVolunteers
);

router.put(
  "/:id/approve",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  approveVolunteer
);

router.put(
  "/:id/reject",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  rejectVolunteer
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  deleteVolunteer
);

export default router;