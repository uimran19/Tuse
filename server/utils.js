function getNext365Dates() {
  const currentTimestamp = Date.now();
  let dates = [];
  let timestampStep = currentTimestamp;

  for (let i = 1; i <= 365; i++) {
    let date = new Date(timestampStep);

    dates.push([
      i,
      `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    ]);

    timestampStep += 1000 * 60 * 60 * 24;
  }
  return dates;
}

function getTodaysDate() {
  const currentTimestamp = Date.now();
  const date = new Date(currentTimestamp);
  const formattedDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  return formattedDate;
}

module.exports = { getNext365Dates, getTodaysDate };
