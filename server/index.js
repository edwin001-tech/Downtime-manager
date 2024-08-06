const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// API to get all issues
app.get('/api/issues', (req, res) => {
  db.query('SELECT * FROM issues', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// API to create a new issue
app.post('/api/issues', (req, res) => {
  const { issue, since, service, cause, impact, actions } = req.body;
  const query = `INSERT INTO issues (issue, since, service, cause, impact, actions) VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(query, [issue, since, service, cause, impact, JSON.stringify(actions)], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send({ id: results.insertId });
  });
});

// API to update an issue
app.put('/api/issues/:id', (req, res) => {
  const { id } = req.params;
  const { issue, since, service, cause, impact, actions, resolved } = req.body;
  const query = `UPDATE issues SET issue = ?, since = ?, service = ?, cause = ?, impact = ?, actions = ?, resolved = ? WHERE id = ?`;

  db.query(query, [issue, since, service, cause, impact, JSON.stringify(actions), resolved, id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send({ affectedRows: results.affectedRows });
  });
});

// API to delete an issue
app.delete('/api/issues/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM issues WHERE id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send({ affectedRows: results.affectedRows });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
