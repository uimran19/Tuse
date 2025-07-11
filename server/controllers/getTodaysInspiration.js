const selectInspirationData = require("../models/selectInspirationData");
const fetchInspiration = require("../models/fetchInspiration");
const { getTodaysDate } = require("../utils");

function getTodaysInspiration(req, res, next) {
  const todaysDate = getTodaysDate();
  return selectInspirationData(todaysDate)
    .then(({ rows: [{ artwork_id, image_id }] }) => {
      return { artwork_id, image_id };
    }).then(({artwork_id, image_id}) => {
      return fetchInspiration(artwork_id, image_id)
    }).then((artwork) => {
      return artwork
      // response.status(200).send({artwork})
    })
    .catch((err) => {
      console.log(err);
    });
}

getTodaysInspiration().then((res) => console.log(res));

module.exports = getTodaysInspiration;
