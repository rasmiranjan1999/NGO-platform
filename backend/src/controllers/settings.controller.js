import { deleteFile } from "../utils/file.utils.js";

export const getSettings = async (req, res) => {
  try {
    const db = req.app.locals.db;

    let result = await db.query(`
      SELECT *
      FROM settings
      LIMIT 1
    `);

    // Auto create settings row if missing
    if (result.rows.length === 0) {
      await db.query(`
        INSERT INTO settings(id)
        VALUES (1)
      `);

      result = await db.query(`
        SELECT *
        FROM settings
        LIMIT 1
      `);
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

export const updateSettings = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const {
      ngo_name,
      registration_number,

      phone,
      email,
      address,
      map_location,

      history,
      vision,
      mission,

      logo,
      favicon,

      president_photo,
      president_message,

      secretary_photo,
      secretary_message,

      facebook,
      instagram,
      youtube,
      twitter,
      linkedin,
    } = req.body;

    let existing = await db.query(`
      SELECT *
      FROM settings
      WHERE id = 1
    `);

    // Auto create settings row if missing
    if (existing.rows.length === 0) {
      await db.query(`
        INSERT INTO settings(id)
        VALUES (1)
      `);

      existing = await db.query(`
        SELECT *
        FROM settings
        WHERE id = 1
      `);
    }

    const oldSettings = existing.rows[0] || {};

    // Delete old logo
    if (
      logo &&
      oldSettings.logo &&
      logo !== oldSettings.logo
    ) {
      deleteFile(oldSettings.logo);
    }

    // Delete old favicon
    if (
      favicon &&
      oldSettings.favicon &&
      favicon !== oldSettings.favicon
    ) {
      deleteFile(oldSettings.favicon);
    }

    // Delete old president photo
    if (
      president_photo &&
      oldSettings.president_photo &&
      president_photo !== oldSettings.president_photo
    ) {
      deleteFile(
        oldSettings.president_photo
      );
    }

    // Delete old secretary photo
    if (
      secretary_photo &&
      oldSettings.secretary_photo &&
      secretary_photo !== oldSettings.secretary_photo
    ) {
      deleteFile(
        oldSettings.secretary_photo
      );
    }

    const result = await db.query(
      `
      UPDATE settings
      SET
        ngo_name=$1,
        registration_number=$2,

        phone=$3,
        email=$4,
        address=$5,
        map_location=$6,

        history=$7,
        vision=$8,
        mission=$9,

        logo=$10,
        favicon=$11,

        president_photo=$12,
        president_message=$13,

        secretary_photo=$14,
        secretary_message=$15,

        facebook=$16,
        instagram=$17,
        youtube=$18,
        twitter=$19,
        linkedin=$20

      WHERE id=1

      RETURNING *
      `,
      [
        ngo_name,
        registration_number,

        phone,
        email,
        address,
        map_location,

        history,
        vision,
        mission,

        logo,
        favicon,

        president_photo,
        president_message,

        secretary_photo,
        secretary_message,

        facebook,
        instagram,
        youtube,
        twitter,
        linkedin,
      ]
    );

    res.json({
      success: true,
      message:
        "Settings updated successfully",
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