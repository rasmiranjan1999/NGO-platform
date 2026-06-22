export const generateVolunteerId = async (db) => {
  const today = new Date();

  const datePart =
    today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0");

  const result = await db.query(
    "SELECT COUNT(*) FROM volunteers WHERE volunteer_id IS NOT NULL"
  );

  const count = Number(result.rows[0].count) + 1;

  return `BKSS-VOL-${datePart}-${String(count).padStart(4, "0")}`;
};