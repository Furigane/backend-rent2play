const express = require('express');
const db = require('./bd'); 
const app = express();
const PORT = 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/api/accounts', async (req, res) => {
  try {
    const [data] = await db.query('SELECT * FROM accounts');
    res.json(data);

  } catch (err) {
    console.error('Ошибка при получении аккаунтов:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.put('/api/accounts/balance', async (req, res) => {
  const { email, balance } = req.body;

  if (!email || balance === undefined) {
    return res.status(400).json({ error: 'email и balance обязательны' });
  }

  try {
    const [result] = await db.query(
      'UPDATE accounts SET balance = ? WHERE email = ?',
      [balance, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Аккаунт с таким email не найден' });
    }

    res.json({ message: 'Баланс успешно обновлён' });
  } catch (err) {
    console.error('Ошибка при обновлении баланса:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }});

app.post('/api/accounts', async (req, res) => {
  const { email, password, balance, isAdmin, nickname, registrationDate } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email, password обязательны' });
  }

  const isAdminBool = isAdmin === 'true' || isAdmin === true ? 1 : 0;
  const formattedDate = registrationDate
    ? new Date(registrationDate).toISOString().slice(0, 19).replace('T', ' ')
    : new Date().toISOString().slice(0, 19).replace('T', ' ');

  try {
    const [result] = await db.query(
      'INSERT INTO accounts (email, password, balance, isAdmin, nickname, registrationDate) VALUES (?, ?, ?, ?, ?, ?)',
      [email, password, balance, isAdminBool, nickname, formattedDate]
    );

    res.status(201).json({
      message: 'Аккаунт успешно добавлен',
      id: result.insertId
    });
  } catch (err) {
    console.error('Ошибка при добавлении аккаунта:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});