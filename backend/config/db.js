// backend/config/db.js
const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'Boomdod#1998',
  server: 'localhost',
  port: 1433, // ✅ เพิ่มพอร์ต
  database: 'TestVispectraDB',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ MSSQL Connected');
    return pool;
  })
  .catch(err => console.error('❌ Database Connection Failed:', err));

module.exports = {
  sql,
  poolPromise
};
