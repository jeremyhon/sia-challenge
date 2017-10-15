var _ = require("lodash");
var json2csv = require('json2csv');

// seats
const TYPES_OF_RED_DEFECTS = ["Reclining Seats", "Seat Belt"];
const TYPES_OF_ORANGE_DEFECTS = [
  "Footrest",
  "Trays",
  "Lights",
  "IFE",
  "Aircon"
];
const GREEN = "GREEN";
const ORANGE = "ORANGE";
const YELLOW = "YELLOW";
const RED = "RED";

// logs
var STATUS_FIXED = "FIXED";
var STATUS_DEFECT = "DEFECT";
const TYPES_OF_STATUS = [STATUS_FIXED, STATUS_DEFECT];

// CLASSES
class PlaneType {
  constructor(rows, columns, aisleColumns) {
    this.rows = rows;
    this.columns = columns;
    this.aisleColumns = aisleColumns;
  }
  get numberOfSeats() {
    return this.rows * this.columns;
  }
}

function itemsFor(type) {
  var map = new Map([
    ["Reclining Seats", ["Knob", "Seat", "Cushion"]],
    ["Seat Belt", ["Buckle", "Strap"]],
    ["Footrest", ["Padding", "Frame"]],
    ["Trays", ["Board", "Frame"]],
    ["Lights", ["Bulb", "Cover"]],
    ["IFE", ["Screen"]],
    ["Aircon", ["Knob"]]
  ]);
  return map.get(type);
}

class Defect {
  constructor(type) {
    this.type = type;
    this.logs = [];
  }

  get status() {
    var latestLog = this.logs.reduce((latest, log) => {
      if (latest && latest.timestamp > log.timestamp) {
        return latest;
      } else {
        return log;
      }
    }, null);
    if (latestLog) {
      return latestLog.status;
    } else {
      return "FIXED";
    }
  }

  get color() {
    function withinMonth(lastFixedLog) {
      var actualDate = new Date();
      var dateToCheck = new Date(lastFixedLog);
      console.log(`within month: ${actualDate}, ${dateToCheck}`);
      return dateToCheck.getMonth() == actualDate.getMonth() &&
        dateToCheck.getFullYear() == actualDate.getFullYear();
    }

    if (this.logs.length === 0) {
      return GREEN;
    }
    var latestLog = this.logs.reduce((latest, log) => {
      if (latest.timestamp > log.timestamp) {
        return latest;
      } else {
        return log;
      }
    });
    if (latestLog.status === "FIXED") {
      if (withinMonth(latestLog.timestamp)) {
        return YELLOW;
      } else {
        return GREEN;
      }
    } else {
      return TYPES_OF_ORANGE_DEFECTS.includes(this.type) ? ORANGE : RED;
    }
  }

  get timesDeferred() {
    this.logs.sort((a, b) => {
      return a.timestamp - b.timestamp;
    });
    var result = 0;
    _.each(this.logs, log => {
      if (log.status === "FIXED") {
        result = 0;
      } else {
        result++;
      }
    });
    return result;
  }

  get timestamp() {
    var latestLog = this.logs.reduce((latest, log) => {
      if (latest && latest.timestamp > log.timestamp) {
        return latest;
      } else {
        return log;
      }
    }, null);
    return latestLog.timestamp;
  }

  get items() {
    return itemsFor(this.type);
  }

  addLog(log) {
    this.logs.push(log);
  }

  toJson() {
    return {
      type: this.type,
      timesDeferred: this.timesDeferred,
      color: this.color,
      timestamp: this.timestamp,
      items: this.items
    };
  }
}

class Seat {
  constructor(defects, status, isAisle) {
    this.defects = defects;
    this.isAisle = isAisle;
  }

  toJson() {
    return {
      defect: this.defects.filter(d => d.color !== GREEN).map(d => d.toJson()),
      isAisle: this.isAisle
    };
  }

  get currentDefects() {
    return this.defects.filter(d => d.status === "DEFECT");
  }

  defectOfType(type) {
    var defect = this.defects.filter(d => d.type === type);
    if (defect.length > 0) {
      return defect[0];
    } else {
      return null;
    }
  }

  updateWith(log) {
    if (this.defectOfType(log.type)) {
      this.defectOfType(log.type).addLog(log);
    } else {
      var defect = new Defect(log.type);
      defect.addLog(log);
      this.defects.push(defect);
    }
  }
}

class Plane {
  constructor(planeId, flightNumber, type, seats, arrival, departure) {
    this.planeId = planeId;
    this.flightNumber = flightNumber;
    this.type = type;
    this.seats = seats;
    this.arrival = arrival;
    this.departure = departure;
  }
  toJson() {
    return {
      seats: this.seats.map(row => {
        return row.map(seat => seat.toJson());
      }),
      arrival: this.arrival,
      departure: this.departure,
      flightNumber: this.flightNumber,
      planeId: this.planeId
    };
  }
}

const PLANE_TYPES = [
  new PlaneType(30, 7, [3]),
  new PlaneType(20, 5, [2]),
  new PlaneType(50, 12, [3, 8])
];



function generateLogData(NUMBER_OF_PLANES, NUMBER_OF_LOGS) {
  function pickRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function planeType(flightNumber) {
    return PLANE_TYPES[flightNumber % PLANE_TYPES.length];
  }
  function pickRandomTimeWithinLastYear(today) {
    function getRandomDate(from, to) {
      from = from.getTime();
      to = to.getTime();
      return new Date(from + Math.random() * (to - from));
    }
    var oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth());
    return getRandomDate(oneYearAgo, today);
  }
  const LOG_DATA = [];

  for (var i = 0; i < NUMBER_OF_LOGS; i++) {
    var flightNumber = Math.floor(Math.random() * NUMBER_OF_PLANES);
    var pType = planeType(flightNumber);
    var today = new Date();
    var log = {
      type: pickRandomElement(
        TYPES_OF_RED_DEFECTS.concat(TYPES_OF_ORANGE_DEFECTS)
      ),
      flight_number: flightNumber,
      seat_number: Math.floor(Math.random() * pType.numberOfSeats),
      timestamp: pickRandomTimeWithinLastYear(today).getTime(),
      status: pickRandomElement(TYPES_OF_STATUS)
    };
    LOG_DATA.push(log);
  }
  return LOG_DATA;
}

function generatePlaneData(NUMBER_OF_PLANES) {
  function getPlaneType(flightId) {
    return PLANE_TYPES[flightId % PLANE_TYPES.length];
  }
  function getSeatId(r, c, planeType) {
    return c + r * planeType.columns;
  }
  function getRow(seatId, planeId) {
    var planeType = getPlaneType(planeId);
    var row = Math.floor(seatId / planeType.columns);
    return row;
  }
  function getCol(seatId, planeId) {
    var planeType = getPlaneType(planeId);
    return seatId % planeType.columns;
  }
  function getRandomDate(from, to) {
    from = from.getTime();
    to = to.getTime();
    return new Date(from + Math.random() * (to - from));
  }

  function getRandomTimeInNext24Hours(time) {
    var oneDayLater = new Date(
      time.getFullYear(),
      time.getMonth(),
      time.getDate() + 1,
      time.getHours(),
      time.getMinutes()
    );
    return getRandomDate(time, oneDayLater);
  }

  const PLANES = [];
  const NUMBER_OF_LOGS = 1000;
  const LOG_DATA = generateLogData(NUMBER_OF_PLANES, NUMBER_OF_LOGS);
  LOG_DATA.sort((a, b) => {
    return a.timestamp - b.timestamp;
  });

  var now = new Date();

  for (var i = 0; i < NUMBER_OF_PLANES; i++) {
    var planeType = getPlaneType(i);
    var seats = new Array(planeType.rows);
    for (var r = 0; r < planeType.rows; r++) {
      seats[r] = new Array(planeType.columns);
      for (var c = 0; c < planeType.columns; c++) {
        seats[r][c] = new Seat([], GREEN, planeType.aisleColumns.includes(c));
      }
    }
    var arrival = getRandomTimeInNext24Hours(now);
    var departure = getRandomTimeInNext24Hours(arrival);
    var flightNumber = "SQ" + _.random(0, 10000000000);
    PLANES.push(
      new Plane(
        i,
        flightNumber,
        getPlaneType(i),
        seats,
        arrival.getTime(),
        departure.getTime()
      )
    );
  }
  _.each(LOG_DATA, log => {
    var planeId = log.flight_number;
    var seatId = log.seat_number;
    PLANES[planeId].seats[getRow(seatId, planeId)][
      getCol(seatId, planeId)
    ].updateWith(log);
  });
  return PLANES;
}

function getPlanes(numberOfPlanes) {
  return generatePlaneData(numberOfPlanes).map(plane => plane.toJson());
}

function getcsv(NUMBER_OF_PLANES, NUMBER_OF_LOGS){
  var logs = generateLogData(NUMBER_OF_PLANES, NUMBER_OF_LOGS).map(log => {
    var date = new Date(log.timestamp);
    var month = date.getMonth() < 10 ? "0" + date.getMonth() : "" + date.getMonth();
    var day = date.getDate() < 10 ? "0" + date.getDate() : "" + date.getDate();
    var hours = date.getHours() < 10 ? "0" + date.getHours() : "" + date.getHours();
    var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : "" + date.getMinutes();
    var sec = date.getSeconds() < 10 ? "0" + date.getSeconds() : "" + date.getSeconds();
    return {
      type: log.type,
      plane_number: log.flight_number,
      seat_number: log.seat_number,
      timestamp: `${date.getFullYear()}-${month}-${day} ${hours}:${min}:${sec}`,
      status: log.status
    }
  });

  var fields = ['type', 'plane_number', 'seat_number', 'timestamp', 'status'];
  var result = json2csv({ data: logs, fields: fields });
  return result;
}

window.getPlanes = getPlanes;
window.generateLogData = generateLogData;
window.getcsv = getcsv;

export default getPlanes;

// console.log(getcsv(100, 1000000));
