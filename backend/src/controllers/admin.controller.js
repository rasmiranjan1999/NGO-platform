import bcrypt from "bcryptjs";

export const createAdmin = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existing = await db.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `
      INSERT INTO users
      (
        name,
        email,
        password,
        role
      )
      VALUES
      ($1,$2,$3,'admin')
      RETURNING
      id,
      name,
      email,
      role,
      created_at
      `,
      [name, email, hash]
    );

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create admin",
    });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const result = await db.query(`
      SELECT
        id,
        name,
        email,
        role,
        created_at
      FROM users
      WHERE role IN ('super_admin','admin')
      ORDER BY id
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch admins",
    });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const { id } = req.params;

    const admin = await db.query(
      `
      SELECT id, role
      FROM users
      WHERE id=$1
      `,
      [id]
    );

    if (admin.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (admin.rows[0].role === "super_admin") {
      return res.status(400).json({
        success: false,
        message: "Super Admin cannot be deleted",
      });
    }

    await db.query(
      `
      DELETE FROM users
      WHERE id=$1
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete admin",
    });
  }
};