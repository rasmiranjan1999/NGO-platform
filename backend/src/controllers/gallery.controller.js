import { deleteFile } from "../utils/file.utils.js";

export const createAlbum = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const { title, event_date } = req.body;

    const result = await db.query(
      `
      INSERT INTO albums
      (
        title,
        event_date
      )
      VALUES
      ($1,$2)
      RETURNING *
      `,
      [title, event_date]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAlbums = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const result = await db.query(`
      SELECT
        a.*,
        COUNT(g.id)::int AS total_images,
        MIN(g.image) AS cover_image
      FROM albums a
      LEFT JOIN gallery_images g
      ON g.album_id = a.id
      GROUP BY a.id
      ORDER BY a.event_date DESC
    `);

    res.json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAlbumDetails = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const album = await db.query(
      `
      SELECT *
      FROM albums
      WHERE id=$1
      `,
      [req.params.id]
    );

    if (album.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    const images = await db.query(
      `
      SELECT *
      FROM gallery_images
      WHERE album_id=$1
      ORDER BY created_at DESC
      `,
      [req.params.id]
    );

    res.json({
      success: true,
      album: album.rows[0],
      images: images.rows,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addGalleryImage = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const {
      album_id,
      image,
      title,
    } = req.body;

    console.log(req.body);

    const result = await db.query(
      `
      INSERT INTO gallery_images
      (
        album_id,
        image,
        title
      )
      VALUES
      ($1,$2,$3)
      RETURNING *
      `,
      [
        album_id,
        image,
        title || "",
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecentImages = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const result = await db.query(
      `
      SELECT *
      FROM gallery_images
      ORDER BY created_at DESC
      LIMIT 12
      `
    );

    res.json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteGalleryImage = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const existing = await db.query(
      `
      SELECT image
      FROM gallery_images
      WHERE id=$1
      `,
      [req.params.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    deleteFile(
      existing.rows[0].image
    );

    await db.query(
      `
      DELETE FROM gallery_images
      WHERE id=$1
      `,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Image deleted",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const images = await db.query(
      `
      SELECT image
      FROM gallery_images
      WHERE album_id=$1
      `,
      [req.params.id]
    );

    for (const img of images.rows) {
      deleteFile(img.image);
    }

    await db.query(
      `
      DELETE FROM gallery_images
      WHERE album_id=$1
      `,
      [req.params.id]
    );

    await db.query(
      `
      DELETE FROM albums
      WHERE id=$1
      `,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Album deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};