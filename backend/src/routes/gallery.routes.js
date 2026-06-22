import express from "express";

import {
  createAlbum,
  getAlbums,
  getAlbumDetails,
  addGalleryImage,
  getRecentImages,
  deleteGalleryImage,
  deleteAlbum,
} from "../controllers/gallery.controller.js";

import {
  authenticateToken,
} from "../middleware/auth.middleware.js";

import {
  authorizeRoles,
} from "../middleware/role.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

router.get(
  "/albums",
  getAlbums
);

router.get(
  "/albums/:id",
  getAlbumDetails
);

router.get(
  "/recent",
  getRecentImages
);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

router.post(
  "/albums",
  authenticateToken,
  authorizeRoles(
    "super_admin",
    "admin"
  ),
  createAlbum
);

/*
|--------------------------------------------------------------------------
| Add Single Image
|--------------------------------------------------------------------------
*/

router.post(
  "/images",
  authenticateToken,
  authorizeRoles(
    "super_admin",
    "admin"
  ),
  addGalleryImage
);

/*
|--------------------------------------------------------------------------
| Add Multiple Images
|--------------------------------------------------------------------------
*/

router.post(
  "/images/bulk",
  authenticateToken,
  authorizeRoles(
    "super_admin",
    "admin"
  ),
  addGalleryImage
);

/*
|--------------------------------------------------------------------------
| Delete Image
|--------------------------------------------------------------------------
*/

router.delete(
  "/albums/:id",
  authenticateToken,
  authorizeRoles("super_admin", "admin"),
  deleteAlbum
);

export default router;