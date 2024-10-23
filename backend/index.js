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

// Function to calculate the number of pages
const calculateTotalPages = (totalItems, itemsPerPage) => {
  return Math.ceil(totalItems / itemsPerPage);
};


// Create a new issue
app.post('/issues', (req, res) => {
  const { issue, since, service, cause, impact, trying, person, additionalInfo } = req.body;
  const query = `
    INSERT INTO issues 
    (issue, since, service, cause, impact, trying, person, additionalInfo, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, "ongoing")
  `;

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
  const query = `
    UPDATE issues 
    SET issue = ?, since = ?, service = ?, cause = ?, impact = ?, trying = ?, person = ?, additionalInfo = ? 
    WHERE id = ?
  `;

  connection.query(query, [issue, since, service, cause, impact, trying, person, additionalInfo, id], (err) => {
    if (err) {
      console.error('Error updating issue:', err);
      res.status(500).json({ error: 'Failed to update issue' });
    } else {
      res.status(200).json({ id, ...req.body });
    }
  });
});

// Resolve an issue (change its status)
app.put('/issues/:id/resolve', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE issues SET status = "resolved" WHERE id = ?';

  connection.query(query, [id], (err) => {
    if (err) {
      console.error('Error resolving issue:', err);
      res.status(500).json({ error: 'Failed to resolve issue' });
    } else {
      res.status(200).json({ message: 'Issue resolved' });
    }
  });
});


// Retrieve resolved issues with pagination by pages
app.get('/resolved-issues', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage) || 6;
  const offset = (page - 1) * itemsPerPage;

  const totalQuery = 'SELECT COUNT(*) as total FROM issues WHERE status = "resolved"';
  const dataQuery = 'SELECT * FROM issues WHERE status = "resolved" LIMIT ? OFFSET ?';

  connection.query(totalQuery, (err, totalResults) => {
    if (err) {
      console.error('Error fetching total resolved issue count:', err);
      res.status(500).json({ error: 'Failed to fetch total resolved issue count' });
      return;
    }

    const totalItems = totalResults[0].total;
    const totalPages = calculateTotalPages(totalItems, itemsPerPage);

    connection.query(dataQuery, [itemsPerPage, offset], (err, issues) => {
      if (err) {
        console.error('Error fetching resolved issues:', err);
        res.status(500).json({ error: 'Failed to fetch resolved issues' });
        return;
      }

      res.json({
        issues,
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage,
      });
    });
  });
});

// Retrieve ongoing issues with pagination by pages
app.get('/ongoing-issues', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage) || 6;
  const offset = (page - 1) * itemsPerPage;

  const totalQuery = 'SELECT COUNT(*) as total FROM issues WHERE status = "ongoing"';
  const dataQuery = 'SELECT * FROM issues WHERE status = "ongoing" LIMIT ? OFFSET ?';

  connection.query(totalQuery, (err, totalResults) => {
    if (err) {
      console.error('Error fetching total ongoing issue count:', err);
      res.status(500).json({ error: 'Failed to fetch total ongoing issue count' });
      return;
    }

    const totalItems = totalResults[0].total;
    const totalPages = calculateTotalPages(totalItems, itemsPerPage);

    connection.query(dataQuery, [itemsPerPage, offset], (err, issues) => {
      if (err) {
        console.error('Error fetching ongoing issues:', err);
        res.status(500).json({ error: 'Failed to fetch ongoing issues' });
        return;
      }

      res.json({
        issues,
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage,
      });
    });
  });
});

// Search for issues with pagination by pages and optional status filter
app.get('/search', (req, res) => {
  const searchTerm = req.query.q || '';
  const status = req.query.status || null;
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage) || 6;
  const offset = (page - 1) * itemsPerPage;

  let query = `
    SELECT SQL_CALC_FOUND_ROWS * FROM issues 
    WHERE (LOWER(issue) LIKE LOWER(?) OR LOWER(service) LIKE LOWER(?) OR LOWER(cause) LIKE LOWER(?) 
    OR LOWER(impact) LIKE LOWER(?) OR LOWER(trying) LIKE LOWER(?) OR LOWER(person) LIKE LOWER(?) 
    OR LOWER(additionalInfo) LIKE LOWER(?))
  `;

  const queryParams = Array(7).fill(`%${searchTerm}%`);

  if (status) {
    query += ` AND status = ?`;
    queryParams.push(status);
  }

  query += ` LIMIT ? OFFSET ?`;
  queryParams.push(itemsPerPage, offset);

  const countQuery = 'SELECT FOUND_ROWS() as total';

  connection.query(query, queryParams, (err, issues) => {
    if (err) {
      console.error('Error searching issues:', err);
      res.status(500).json({ error: 'Failed to search issues' });
      return;
    }

    connection.query(countQuery, (err, countResults) => {
      if (err) {
        console.error('Error fetching total search results count:', err);
        res.status(500).json({ error: 'Failed to fetch total search results count' });
        return;
      }

      const totalItems = countResults[0].total;
      const totalPages = calculateTotalPages(totalItems, itemsPerPage);

      res.json({
        issues,
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage,
      });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
