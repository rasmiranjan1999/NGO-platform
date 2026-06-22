import express from "express";

import {
  getDashboardStats,
  getPublicStats,
  getRecentActivities,
  getSystemHealth,
  getNotifications,
} from "../controllers/dashboard.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Public stats endpoint (no authentication)
router.get("/public-stats", getPublicStats);

// Admin stats endpoint (requires authentication)
router.get(
  "/stats",
  authenticateToken,
  authorizeRoles(
    "super_admin",
    "admin"
  ),
  getDashboardStats
);

// Recent activities endpoint
router.get(
  "/recent-activities",
  authenticateToken,
  authorizeRoles(
    "super_admin",
    "admin"
  ),
  getRecentActivities
);

// System health endpoint
router.get(
  "/system-health",
  authenticateToken,
  authorizeRoles(
    "super_admin",
    "admin"
  ),
  getSystemHealth
);

// Notifications endpoint
router.get(
  "/notifications",
  authenticateToken,
  authorizeRoles(
    "super_admin",
    "admin"
  ),
  getNotifications
);

export default router;