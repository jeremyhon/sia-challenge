// CONSTANTS
var STATUS_FIXED = "FIXED"
var STATUS_DEFECT = "DEFECT"

var NUMBER_OF_ROWS = 30;
var NUMBER_OF_COLUMNS = 7;

// HARD CODED STUFF
const FLIGHT_NUMBER = 1;

const LOG_DATA = [
  {
    type: "reclining seats",
    seat_number: 3,
    time: 1508016106856,
    flight_number: 1,
    status: "FIXED",
  },
  {
    type: "reclining seats",
    seat_number: 3,
    time: 1508016106854,
    flight_number: 1,
    status: "DEFECT",
  },
  {
    type: "seat belt",
    seat_number: 3,
    time: 1508016106853,
    flight_number: 1,
    status: "DEFECT",
  }
];


function isFixed(datum){
  return datum.status === STATUS_FIXED
}

function isDefect(datum){
  return datum.status === STATUS_DEFECT
}

function getScore(flight, seat, data){
  function isFlight(flight_number){
    return function(data){
      return data.flight_number === flight_number;
    }
  }
  function isSeat(seat_number){
    return function(data){
      return data.seat_number === seat_number;
    }
  }
  function latest(data){
    return data.reduce((latest, datum) => {
      if (latest){
        if (latest.time > datum.time) {
          return latest;
        } else {
          return isFixed(datum) ? datum : latest;
        }
      } else if (isFixed(datum)){
        return datum;
      } else {
        return null;
      }
    }, null)
  }
  function withinToday(lastFixedLog){
    var actualDate = new Date();
    var dateToCheck = new Date(lastFixedLog);
    console.log(`now date: ${actualDate.getDate()}, month: ${actualDate.getMonth()}, year: ${actualDate.getFullYear()}`);
    console.log(`before date: ${dateToCheck.getDate()}, month: ${dateToCheck.getMonth()}, year: ${dateToCheck.getFullYear()}`);
    return dateToCheck.getDate() == actualDate.getDate()
        && dateToCheck.getMonth() == actualDate.getMonth()
        && dateToCheck.getFullYear() == actualDate.getFullYear()
  }
  function withinMonth(lastFixedLog){
    var actualDate = new Date();
    var dateToCheck = new Date(lastFixedLog);
    return dateToCheck.getMonth() == actualDate.getMonth()
        && dateToCheck.getFullYear() == actualDate.getFullYear()
  }
  var seatHistoricalData = data.filter(log => {
    return (isFlight(flight))(log) && (isSeat(seat))(log);
  });
  var lastFixedLog = latest(seatHistoricalData);
  if (lastFixedLog) {
    console.log(`last fixed: ${lastFixedLog.time}`)
    if (withinToday(lastFixedLog.time)){
      return 0;
    } else if (withinMonth(lastFixedLog.time)){
      return 0.5;
    } else {
      return 1;
    }
  } else {
    return 1;
  }
}

function getColor(col, row){
  var seatId = col + (row * NUMBER_OF_COLUMNS);
  function isGreen(score){
    return score === 0;
  }
  function isRed(score){
    return score === 1;
  }
  var score = getScore(FLIGHT_NUMBER, seatId, LOG_DATA);
  if (isGreen(score)) return "GREEN";
  if (isRed(score)) return "RED";
  return "YELLOW";
}

export default getColor
