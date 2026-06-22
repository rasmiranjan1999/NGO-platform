import express from "express";
import upload from "../middleware/upload.middleware.js";
import {
  uploadImage,
  uploadMultipleImages,
} from "../controllers/upload.controller.js";

const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  uploadImage
);

router.post(
  "/multiple",
  upload.array("images", 20),
  uploadMultipleImages
);

export default router;