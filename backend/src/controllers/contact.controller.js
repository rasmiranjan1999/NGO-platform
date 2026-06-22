export const createContactMessage = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const {
      name,
      mobile,
      email,
      subject,
      message,
    } = req.body;

    const result = await db.query(
      `
      INSERT INTO contact_messages
      (
        name,
        mobile,
        email,
        subject,
        message
      )
      VALUES
      ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        name,
        mobile,
        email,
        subject,
        message,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Message submitted successfully",
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

export const getContactMessages = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const result = await db.query(
      `
      SELECT *
      FROM contact_messages
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

export const markMessageRead = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const result = await db.query(
      `
      UPDATE contact_messages
      SET is_read=true
      WHERE id=$1
      RETURNING *
      `,
      [req.params.id]
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

export const deleteContactMessage = async (req, res) => {
  try {
    const db = req.app.locals.db;

    await db.query(
      `
      DELETE FROM contact_messages
      WHERE id=$1
      `,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Message deleted",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};