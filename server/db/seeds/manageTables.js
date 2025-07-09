const db = require("../connection");

function dropTable() {
  return db.query(`
        DROP TABLE IF EXISTS artworks;`);
}

function createTable() {
  return db.query(`
        CREATE TABLE artworks (
        artwork_id INT PRIMARY KEY,
        image_id VARCHAR(50) NOT NULL
        );`);
}

module.exports = {dropTable, createTable}
