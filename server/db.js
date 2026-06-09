import 'dotenv/config';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function initDB() {
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            login VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            fio VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            role ENUM('user', 'admin') DEFAULT 'user'
        )
    `);
    await pool.execute(`
        INSERT IGNORE INTO users (
            login, password, fio, phone, email, role
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `, ['Admin26', 'Demo20', 'Администратор', '89123456789', 'admin@example.com', 'admin']);

    await pool.execute(`
        CREATE TABLE IF NOT EXISTS applications (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT,
            name VARCHAR(255) NOT NULL,
            start_date DATE NOT NULL,
            payment ENUM('Наличными', 'По номеру телефона'),
            status ENUM('Новая', 'Мероприятие назначено', 'Мероприятие завершено') DEFAULT 'Новая',
            review TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    console.log('База данных готова к работе.');
}

initDB();

export default pool;