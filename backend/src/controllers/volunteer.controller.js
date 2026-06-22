import { generateVolunteerId } from "../utils/generateVolunteerId.js";

export const applyVolunteer = async (req, res) => {
  try {

    console.log("BODY =", req.body);
    console.log("FILE =", req.file);
    const db = req.app.locals.db;

    const {
      name,
      mobile,
      email,
      address,
      education,
      occupation,
      blood_group,
      reason,
    } = req.body;

    const photo = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const result = await db.query(
      `
      INSERT INTO volunteers
      (
        name,
        mobile,
        email,
        address,
        education,
        occupation,
        blood_group,
        photo,
        reason,
        status
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending')
      RETURNING *
      `,
      [
        name,
        mobile,
        email,
        address,
        education,
        occupation,
        blood_group,
        photo,
        reason,
      ]
    );

    res.status(201).json({
      success: true,
      message:
        "Volunteer application submitted",
      data: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to submit application",
    });
  }
};

export const getVolunteers = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const result = await db.query(
      `
      SELECT *
      FROM volunteers
      ORDER BY id DESC
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
      message: "Failed to fetch volunteers",
    });
  }
};

export const approveVolunteer = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const volunteerId = await generateVolunteerId(db);

    const result = await db.query(
      `
      UPDATE volunteers
      SET
        status='approved',
        volunteer_id=$1,
        approved_by=$2,
        approved_at=NOW()
      WHERE id=$3
      RETURNING *
      `,
      [
        volunteerId,
        req.user.id,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.json({
      success: true,
      message: "Volunteer approved",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
};

export const rejectVolunteer = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const result = await db.query(
      `
      UPDATE volunteers
      SET status='rejected'
      WHERE id=$1
      RETURNING *
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.json({
      success: true,
      message: "Volunteer rejected",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Reject failed",
    });
  }
};

export const getPublicVolunteers = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const result = await db.query(
      `
      SELECT
        volunteer_id,
        name,
        photo,
        blood_group
      FROM volunteers
      WHERE status='approved'
      ORDER BY id DESC
      `
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
        console.error("Volunteer Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteVolunteer = async (req, res) => {
  try {
    const db = req.app.locals.db;

    await db.query(
      `
      DELETE FROM volunteers
      WHERE id=$1
      `,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Volunteer deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};