// 📁 backend/controllers/userController.js
const db = require('../config/db');

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query(
      'SELECT * FROM users WHERE username = @username AND password = @password',
      {
        username: { type: db.VarChar, value: username },
        password: { type: db.VarChar, value: password },
      }
    );
    const user = result.recordset[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ id: user.id, username: user.username, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
