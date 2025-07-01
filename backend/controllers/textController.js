const { sql, poolPromise } = require('../config/db');

// ✅ ฟังก์ชัน: getTargetTexts (ดึงทั้งหมด)
const getTargetTexts = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT id, content AS text, bold, all_caps, underline,
             check_char, min_size_mm, size_group_id
      FROM text_targets
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('getTargetTexts error:', err);
    res.status(500).json({ error: "Database query error", detail: err.message });
  }
};

// ✅ ฟังก์ชัน: getTargetsByCategory (ตามชื่อ category)
const getTargetsByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('category', sql.VarChar, category)
      .query(`
        SELECT tt.id, tt.content AS text, tt.bold, tt.all_caps, tt.underline,
               tt.check_char, tt.min_size_mm, tt.size_group_id
        FROM text_targets tt
        JOIN text_target_categories tc ON tc.text_target_id = tt.id
        JOIN text_categories cat ON cat.id = tc.category_id
        WHERE cat.name = @category
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('getTargetsByCategory error:', err);
    res.status(500).json({ error: "Database query error", detail: err.message });
  }
};

module.exports = {
  getTargetTexts,
  getTargetsByCategory
};
