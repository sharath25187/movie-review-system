const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: {
      ca: fs.readFileSync('./ca.pem')
    }
  });
  

db.connect(err => {
  if (err) {
    console.error('Connection error:', err);
  } else {
    console.log('Connected to Aiven MySQL!');
  }
});

module.exports = db;

