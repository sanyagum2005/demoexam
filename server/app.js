import express, { application } from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.post('/api/register', async (req, res) => {
  const {login, password, fio, email, phone} = req.body;
  const [result] = await pool.execute('INSERT INTO users (login, password, fio, email, phone) VALUES (?, ?, ?, ?, ?)', [login, password, fio, email, phone]);
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
  const {id, role} = rows[0];
  res.status(200).json({
    id,
    role,
  });
});


app.post('/api/login', async (req, res) => {
  const {login, password} = req.body;
  const query = `
    SELECT id, fio, role
    FROM users
    WHERE login = ? and password = ?
  `;
  const [rows] = await pool.execute(query, [login, password]);

  if (!rows.length) return res.status(404).send('Пользователь не найден');

  res.status(200).json(rows[0]);
});


app.get('/api/applications/:userId', async (req, res) => {
  const {userId} = req.params;
  const [rows] = await pool.execute('SELECT * FROM applications WHERE user_id = ?', [+userId]);
  res.status(200).json(rows);
});


app.post('/api/applications', async (req, res) => {
  const {userId, name, startDate, paymentMethod} = req.body;
  await pool.execute('INSERT INTO applications (user_id, course_name, start_date, payment_method) VALUES (?, ?, ?, ?)', [userId, name, new Date(startDate), paymentMethod]);
  res.status(200).send();
});

app.put('/api/applications/:id/review', async (req, res) => {
  const {id} = req.params;
  const {review} = req.body;
  await pool.execute('UPDATE applications SET review = ? WHERE id = ?', [review, id]);
  res.status(200).send();
});


app.get('/api/admin/applications', async (req, res) => {
  const query = `
    SELECT
      applications.*,
      users.fio,
      users.email,
      users.phone
    FROM applications
    LEFT JOIN users ON applications.user_id = users.id;
  `;
  const [rows] = await pool.execute(query);
  res.status(200).json(rows);
});


app.put('/api/admin/applications/:id', async (req, res) => {
  const {id} = req.params;
  const {status} = req.body;
  const [rows] = await pool.execute('UPDATE applications SET status = ? WHERE id = ?', [status, id]);
  res.status(200).send();
});



app.listen(3000, () => console.log('Сервер запущен'));