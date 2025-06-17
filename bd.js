const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'sql8.freesqldatabase.com',   
  user: 'sql8785287',          
  password: 'ZBgIbQHY1T', 
  database: 'sql8785287',   
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();