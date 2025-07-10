import db from "../connection";

export function dropTable() {
  return db.query(`
        DROP TABLE IF EXISTS artworks;`);
}

export function createTable() {
  return db.query(`
        CREATE TABLE artworks (
        artwork_id INT PRIMARY KEY,
        image_id VARCHAR(50) NOT NULL
        );`);
}

// export default { dropTable, createTable };
