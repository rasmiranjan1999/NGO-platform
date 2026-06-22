import { generateMemberId } from "../utils/generateMemberId.js";
import { deleteFile } from "../utils/file.utils.js";

export const createMember = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const {
      name,
      photo,
      mobile,
      email,
      address,
      occupation,
      qualification,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const memberId = await generateMemberId(db);

    const result = await db.query(
      `
      INSERT INTO members
      (
        member_id,
        name,
        photo,
        mobile,
        email,
        address,
        occupation,
        qualification
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        memberId,
        name,
        photo || null,
        mobile,
        email,
        address,
        occupation,
        qualification,
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
      message: "Failed to create member",
    });
  }
};

export const getMembers = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const result = await db.query(
      "SELECT * FROM members ORDER BY id DESC"
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch members",
    });
  }
};

export const getPublicMembers = async (req, res) => {
  try {
    const db = req.app.locals.db;

    // Get all members - photos, names, IDs, occupations are public
    const result = await db.query(
      "SELECT id, member_id, name, photo, mobile, email, address, occupation, qualification, created_at FROM members ORDER BY name ASC"
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch members",
    });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const existing = await db.query(
      `
      SELECT photo
      FROM members
      WHERE id=$1
      `,
      [req.params.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    deleteFile(
      existing.rows[0].photo
    );

    await db.query(
      `
      DELETE FROM members
      WHERE id=$1
      `,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Member deleted",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

export const updateMember = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const {
      name,
      photo,
      mobile,
      email,
      address,
      occupation,
      qualification,
    } = req.body;

    const existing = await db.query(
      `
      SELECT *
      FROM members
      WHERE id=$1
      `,
      [req.params.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
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
      UPDATE members
      SET
        name=$1,
        photo=$2,
        mobile=$3,
        email=$4,
        address=$5,
        occupation=$6,
        qualification=$7
      WHERE id=$8
      RETURNING *
      `,
      [
        name,
        photo,
        mobile,
        email,
        address,
        occupation,
        qualification,
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
      message: "Update failed",
    });
  }
};