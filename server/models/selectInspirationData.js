const format = require("pg-format");
const db = require("../db/connection");

function selectInspirationData(date) {
  const query = format(
    `
        SELECT artwork_id, image_id 
        FROM artworks 
        WHERE daily_inspiration_date = %L;
    `,
    [date]
  );

  return db.query(query);
}

module.exports = selectInspirationData;

// selectInspirationData("2025-07-11").then((res) => console.log(res.rows));
