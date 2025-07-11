const format = require("pg-format");
const db = require("../db/connection");

function fetchInspiration(artwork_id, image_id, size){
    return fetch(`https://api.artic.edu/api/v1/artworks/${artwork_id}/manifest.json`)
    .then((res) => {
        return res.json()
    }).then((res)=>{
        res.thumbnailUrl = `https://www.artic.edu/iiif/2/${image_id}/full/400,/0/default.jpg`
        res.imageUrl = `https://www.artic.edu/iiif/2/${image_id}/full/1686,/0/default.jpg`
        return 
        {res}
    })
}

fetchInspiration(28560)
module.exports = fetchInspiration