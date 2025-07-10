const { getNext365Dates } = require("../../utils");
const db = require("../connection");
const format = require("pg-format");

function seedInspiration() {
  const dates = getNext365Dates();

  const formattedDates = dates.map((date) => {
    return format(
      `UPDATE artworks
        SET daily_inspiration_date = %L
        WHERE id = 1;`,
      [date]
    );
  });

  console.log(formattedDates);
}

seedInspiration();
