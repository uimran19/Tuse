export function getTodaysDate() {
  const currentTimestamp = Date.now();
  const date = new Date(currentTimestamp);
  const formattedDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  return formattedDate;
}

export function getNDates(numOfDates) {
  const currentTimestamp = Date.now();
  let dates = [];
  let timestampStep = currentTimestamp;

  if (typeof numOfDates !== "number" || Math.sign(numOfDates) === 0) {
    throw Error({ source: "getNDates", message: "bad input" });
  } else if (Math.sign(numOfDates) === 1) {
    for (let i = 0; i < numOfDates; i++) {
      let date = new Date(timestampStep);
      dates.push([
        i,
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      ]);

      timestampStep += 1000 * 60 * 60 * 24;
    }
  } else if (Math.sign(numOfDates) === -1) {
    for (let i = 0; i > numOfDates; i--) {
      let date = new Date(timestampStep);
      dates.push([
        i,
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      ]);

      timestampStep -= 1000 * 60 * 60 * 24;
    }
  }

  return dates;
}

export function createRoomId() {
  function getRandomStringOf4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return getRandomStringOf4() + "-" + getRandomStringOf4();
}
