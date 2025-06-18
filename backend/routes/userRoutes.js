// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, password)
      .query(`
        SELECT * FROM users 
        WHERE username = @username AND password = @password
      `);

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
