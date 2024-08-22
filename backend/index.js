const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection setup
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Routes

// Get all issues (both ongoing and resolved)
app.get('/issues', (req, res) => {
  const query = 'SELECT * FROM issues';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching issues:', err);
      res.status(500).json({ error: 'Failed to fetch issues' });
    } else {
      res.json(results);
    }
  });
});

// Create a new issue
app.post('/issues', (req, res) => {
  const { issue, since, service, cause, impact, trying, person, additionalInfo } = req.body;
  const query = 'INSERT INTO issues (issue, since, service, cause, impact, trying, person, additionalInfo, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "ongoing")';
  connection.query(query, [issue, since, service, cause, impact, trying, person, additionalInfo], (err, result) => {
    if (err) {
      console.error('Error creating issue:', err);
      res.status(500).json({ error: 'Failed to create issue' });
    } else {
      res.status(201).json({ id: result.insertId, ...req.body, status: "ongoing" });
    }
  });
});

// Update an issue
app.put('/issues/:id', (req, res) => {
  const { id } = req.params;
  const { issue, since, service, cause, impact, trying, person, additionalInfo } = req.body;
  const query = 'UPDATE issues SET issue = ?, since = ?, service = ?, cause = ?, impact = ?, trying = ?, person = ?, additionalInfo = ? WHERE id = ?';
  connection.query(query, [issue, since, service, cause, impact, trying, person, additionalInfo, id], (err) => {
    if (err) {
      console.error('Error updating issue:', err);
      res.status(500).json({ error: 'Failed to update issue' });
    } else {
      res.status(200).json({ id, ...req.body });
    }
  });
});

// Resolve an issue (change its status instead of deleting it)
app.delete('/issues/:id', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE issues SET status = "resolved" WHERE id = ?';
  connection.query(query, [id], (err) => {
    if (err) {
      console.error('Error resolving issue:', err);
      res.status(500).json({ error: 'Failed to resolve issue' });
    } else {
      res.status(204).send();
    }
  });
});

// Retrieve resolved issues separately
app.get('/resolved-issues', (req, res) => {
  const query = 'SELECT * FROM issues WHERE status = "resolved"';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching resolved issues:', err);
      res.status(500).json({ error: 'Failed to fetch resolved issues' });
    } else {
      res.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
