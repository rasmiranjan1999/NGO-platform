import { slugify } from "../utils/slugify.js";
import { deleteFile } from "../utils/file.utils.js";

export const createNews = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const {
      title,
      cover_image,
      description,
      publish_status,
    } = req.body;

    const slug = slugify(title);

    const result = await db.query(
      `
      INSERT INTO news
      (
        title,
        slug,
        cover_image,
        description,
        publish_status
      )
      VALUES
      ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        title,
        slug,
        cover_image,
        description,
        publish_status,
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

export const getNews = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const result = await db.query(
      `
      SELECT *
      FROM news
      ORDER BY created_at DESC
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

export const getLatestNews = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const result = await db.query(
      `
      SELECT *
      FROM news
      WHERE publish_status=true
      ORDER BY created_at DESC
      LIMIT 5
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

export const getNewsBySlug = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const result = await db.query(
      `
      SELECT *
      FROM news
      WHERE slug=$1
      `,
      [req.params.slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    res.json({
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

export const updateNews = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const {
      title,
      cover_image,
      description,
      publish_status,
    } = req.body;

    const existing = await db.query(
      `
      SELECT *
      FROM news
      WHERE id=$1
      `,
      [req.params.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    const oldNews = existing.rows[0];

    if (
      cover_image &&
      oldNews.cover_image &&
      cover_image !== oldNews.cover_image
    ) {
      deleteFile(oldNews.cover_image);
    }

    const slug = slugify(title);

    const result = await db.query(
      `
      UPDATE news
      SET
        title=$1,
        slug=$2,
        cover_image=$3,
        description=$4,
        publish_status=$5
      WHERE id=$6
      RETURNING *
      `,
      [
        title,
        slug,
        cover_image,
        description,
        publish_status,
        req.params.id,
      ]
    );

    res.json({
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

export const deleteNews = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const existing = await db.query(
      `
      SELECT cover_image
      FROM news
      WHERE id=$1
      `,
      [req.params.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    if (existing.rows[0].cover_image) {
      deleteFile(
        existing.rows[0].cover_image
      );
    }

    await db.query(
      `
      DELETE FROM news
      WHERE id=$1
      `,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "News deleted",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};