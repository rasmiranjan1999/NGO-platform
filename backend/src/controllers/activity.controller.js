import { slugify } from "../utils/slugify.js";
import { deleteFile } from "../utils/file.utils.js";

export const createActivity = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const {
      title,
      cover_image,
      description,
      activity_date,
      publish_status,
    } = req.body;

    const slug = slugify(title);

    const result = await db.query(
      `
      INSERT INTO activities
      (
        title,
        slug,
        cover_image,
        description,
        activity_date,
        publish_status
      )
      VALUES
      ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        title,
        slug,
        cover_image,
        description,
        activity_date,
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

export const getActivities = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const result = await db.query(
      `
      SELECT *
      FROM activities
      ORDER BY activity_date DESC
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

export const getActivityBySlug = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const result = await db.query(
      `
      SELECT *
      FROM activities
      WHERE slug=$1
      `,
      [req.params.slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
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

export const updateActivity = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const {
      title,
      cover_image,
      description,
      activity_date,
      publish_status,
    } = req.body;

    const existing = await db.query(
      `
      SELECT *
      FROM activities
      WHERE id=$1
      `,
      [req.params.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    const oldActivity = existing.rows[0];

    if (
      cover_image &&
      oldActivity.cover_image &&
      cover_image !== oldActivity.cover_image
    ) {
      deleteFile(oldActivity.cover_image);
    }

    const slug = slugify(title);

    const result = await db.query(
      `
      UPDATE activities
      SET
        title=$1,
        slug=$2,
        cover_image=$3,
        description=$4,
        activity_date=$5,
        publish_status=$6
      WHERE id=$7
      RETURNING *
      `,
      [
        title,
        slug,
        cover_image,
        description,
        activity_date,
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

export const deleteActivity = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const existing = await db.query(
      `
      SELECT cover_image
      FROM activities
      WHERE id=$1
      `,
      [req.params.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    deleteFile(
      existing.rows[0].cover_image
    );

    await db.query(
      `
      DELETE FROM activities
      WHERE id=$1
      `,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Activity deleted",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};