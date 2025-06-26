const mysql = require('mysql2');
const fs = require('fs');

const db = mysql.createConnection({
  host: 'movie-reviews-sharath25187-324e.c.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_Y6e8jfi0QywHYnDZU-P',
  database: 'defaultdb',
  port: 27952,
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

