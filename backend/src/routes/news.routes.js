import express from "express";

import {
  createNews,
  getNews,
  getLatestNews,
  getNewsBySlug,
  updateNews,
  deleteNews,
} from "../controllers/news.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.get("/", getNews);
router.get("/latest", getLatestNews);
router.get("/:slug", getNewsBySlug);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  createNews
);

router.put(
  "/:id",
  authenticateToken,
 authorizeRoles("super_admin", "admin"),
  updateNews
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  deleteNews
);

export default router;