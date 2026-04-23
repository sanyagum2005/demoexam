import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'korochki_est',
  password: 'root',
});

export default pool;