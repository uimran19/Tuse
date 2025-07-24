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

module.exports = { getNext365Dates };
