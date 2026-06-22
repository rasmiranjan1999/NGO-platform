import { deleteFile } from "../utils/file.utils.js";

export const createTeamMember = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const {
      name,
      designation,
      photo,
      description,
    } = req.body;

    const designationOrder = {
      "President": 1,
      "Vice President": 2,
      "Secretary": 3,
      "Joint Secretary": 4,
      "Treasurer": 5,
      "Member": 6,
    };

    const display_order =
      designationOrder[designation] || 99;

    const result = await db.query(
      `
      INSERT INTO team_members
      (
        name,
        designation,
        photo,
        description,
        display_order
      )
      VALUES
      ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        name,
        designation,
        photo,
        description,
        display_order,
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

export const getTeamMembers = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const result = await db.query(
      `
      SELECT *
      FROM team_members
      ORDER BY display_order ASC, id ASC
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

export const updateTeamMember = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const {
      name,
      designation,
      photo,
      description,
    } = req.body;

    const designationOrder = {
      "President": 1,
      "Vice President": 2,
      "Secretary": 3,
      "Joint Secretary": 4,
      "Treasurer": 5,
      "Member": 6,
    };

    const display_order =
      designationOrder[designation] || 99;

    const existing = await db.query(
      `
      SELECT *
      FROM team_members
      WHERE id=$1
      `,
      [req.params.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    const oldMember = existing.rows[0];

    if (
      photo &&
      oldMember.photo &&
      photo !== oldMember.photo
    ) {
      deleteFile(oldMember.photo);
    }

    const result = await db.query(
      `
      UPDATE team_members
      SET
        name=$1,
        designation=$2,
        photo=$3,
        description=$4,
        display_order=$5
      WHERE id=$6
      RETURNING *
      `,
      [
        name,
        designation,
        photo,
        description,
        display_order,
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

export const deleteTeamMember = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const existing = await db.query(
      `
      SELECT photo
      FROM team_members
      WHERE id=$1
      `,
      [req.params.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    if (existing.rows[0].photo) {
      deleteFile(existing.rows[0].photo);
    }

    await db.query(
      `
      DELETE FROM team_members
      WHERE id=$1
      `,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Team member deleted",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};