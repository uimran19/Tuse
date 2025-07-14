const selectInspirationData = require("../models/selectInspirationData");
const fetchInspiration = require("../models/fetchInspiration");
const { getTodaysDate } = require("../utils");

function getInspiration(date) {
  // const date = req.params("date");
  return selectInspirationData(date)
    .then(({ rows: [{ artwork_id, image_id }] }) => {
      return { artwork_id, image_id };
    })
    .then(({ artwork_id, image_id }) => {
      return fetchInspiration(artwork_id, image_id);
    })
    .then((artwork) => {
      const { label = "Name not found", thumbnailUrl, imageUrl } = artwork;
      const inspiration = {
        title: label,
        artist: "Artist not found",
        medium: "Medium not found",
        thumbnailUrl,
        imageUrl,
      };
      for (let element of artwork.metadata) {
        console.log(element);
        if (element.label.match(/artist/i)) inspiration.artist = element.value;
        else if (element.label.match(/medium/i))
          inspiration.medium = element.value;
      }
      // console.log(inspiration);
      return {
        inspiration,
      };
      // response.status(200).send({artwork})
    })
    .catch((err) => {
      console.log(err);
    });
}

// getInspiration("2026-6-12").then((res) => {
//   console.log(res);
// });

module.exports = getInspiration;
