import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'korochki_est',
  password: 'root',
});

async function initDB() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        login VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        fio VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        role ENUM('user', 'admin') DEFAULT 'user'
      )
    `);

    await pool.execute(`
      INSERT IGNORE INTO users (login, password, fio, role, email, phone) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['Admin', 'KorokNET', 'Администратор системы', 'admin', 'admin@mail.ru', '88005553535']);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        course_name VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        payment_method ENUM('Наличными', 'Переводом по номеру телефона'),
        status ENUM('Новая', 'Идет обучение', 'Обучение завершено') DEFAULT 'Новая',
        review TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('База данных готова к работе');
  } catch (err) {
    console.error('Ошибка инициализации БД:', err.message);
  }
}

initDB();

export default pool;