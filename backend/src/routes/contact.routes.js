import express from "express";

import {
  createContactMessage,
  getContactMessages,
  markMessageRead,
  deleteContactMessage,
} from "../controllers/contact.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

router.post("/", createContactMessage);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  getContactMessages
);

router.put(
  "/:id/read",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  markMessageRead
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  deleteContactMessage
);

export default router;