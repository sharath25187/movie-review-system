const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

// Detect if running on Render
const isRender = process.env.RENDER === 'true';

// Set SSL config only if on Render
const sslConfig = isRender
  ? {
      ca: fs.readFileSync('/etc/secrets/ca.pem')
    }
  : undefined; // No SSL for local

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: sslConfig
});

db.connect(err => {
  if (err) {
    console.error('Connection error:', err);
  } else {
    console.log('Connected to Aiven MySQL!');
  }
});

module.exports = db;




