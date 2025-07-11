const selectInspirationData = require("../models/selectInspirationData");
const { getTodaysDate } = require("../utils");

function getTodaysInspiration(req, res, next) {
  const todaysDate = getTodaysDate();
  return selectInspirationData(todaysDate)
    .then(({ rows: [{ artwork_id, image_id }] }) => {
      return { artwork_id, image_id };
    })
    .catch((err) => {
      console.log(err);
    });
}

getTodaysInspiration().then((res) => console.log(res));

module.exports = getTodaysInspiration;
