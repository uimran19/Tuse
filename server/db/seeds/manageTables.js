const db = require("../connection");

function dropTable() {
  return db.query(`
        `);
}

function createTable() {
  return db.query(`
        DROP TABLE IF EXISTS artworks;
        CREATE TABLE artworks (
        id SERIAL PRIMARY KEY,
        artwork_id INT UNIQUE NOT NULL,
        image_id VARCHAR(50) NOT NULL,
        daily_inspiration_date VARCHAR(10)
        );`);
}

module.exports = { dropTable, createTable };
