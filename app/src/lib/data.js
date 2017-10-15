import _ from 'lodash'

// CONST
const PLANES = [];
const NUMBER_OF_PLANES = 100;

// seats
const TYPES_OF_RED_DEFECTS = ["Reclining Seats", "Seat Belt"];
const TYPES_OF_ORANGE_DEFECTS = ["Footrest", "Trays", "Lights", "IFE", "Aircon"];
const GREEN = "GREEN";
const ORANGE = "ORANGE";
const YELLOW = "YELLOW";
const RED = "RED";

// logs
var STATUS_FIXED = "FIXED";
var STATUS_DEFECT = "DEFECT";
const LOG_DATA = [];
const NUMBER_OF_LOGS = 1000;
const TYPES_OF_STATUS = [STATUS_FIXED, STATUS_DEFECT];

// CLASSES
class PlaneType{
  constructor(rows, columns, aisleColumns){
    this.rows = rows;
    this.columns = columns;
    this.aisleColumns = aisleColumns;
  }
  get numberOfSeats(){
    return this.rows * this.columns;
  }
}

function itemsFor(type){
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

class Defect{
  constructor(type, timestamp, status){
    this.type = type;
    this.timesDeferred = 0;
    this.timestamp = timestamp;
    this.status = status;
  }

  get color(){
    return GREEN;
  }

  get items(){
    return itemsFor(this.type);
  }

  toJson(){
    return {
      type: this.type,
      timesDeferred: this.timesDeferred,
      timestamp: this.timestamp,
      status: this.status
    }
  }
}

class Seat{
  constructor(defects, status, isAisle){
    this.defects = defects;
    this.isAisle = isAisle;
  }
  toJson() {
    return {
      defect: this.defect.map(d => d.toJson()),
      isAisle: this.isAisle
    }
  }
  get latestDefects() {
    function latest(latest, defect){
      if (latest && latest.timestamp > defect.timestamp){
        return latest;
      } else {
        return defect;
      }
    }
    return this.defects.reduce((collected, defect) => {
      var latestDefect = collected.filter(d => d.type === defect.type).reduce(latest, null);
      if (latestDefect && latestDefect.timestamp > defect.timestamp){
        return collected;
      } else {
        return collected.concat([defect]);
      }
    }, []);
  }

  updateWith(log) {
    var defect = new Defect(log.type, log.timestamp, log.status);
    var latestDefectsOfThisType = this.latestDefects.filter(d => d.type === log.type);
    if (latestDefectsOfThisType){
      console.log(`latest defects: ${latestDefectsOfThisType}`);
      if (latestDefectsOfThisType[0].status !== "FIXED")){
        defect.timesDeferred = latestDefectsOfThisType[0].timesDeferred + 1;
      }
    }
    this.defects.push(defect);
  }
}

class Plane{
  constructor(flightNumber, type, seats){
    this.flightNumber = flightNumber;
    this.type = type;
    this.seats = seats;
  }
  toJson(){
    return this.seats;
  }
}

const PLANE_TYPES = [new PlaneType(30, 7, [3]), new PlaneType(20, 5, [2]), new PlaneType(50, 12, [3, 8])];

function generateLogData(){
  function pickRandomElement(arr){
    return arr[Math.floor(Math.random() * arr.length)]
  }
  function planeType(flightNumber){
    return PLANE_TYPES[flightNumber % PLANE_TYPES.length];
  }
  function pickRandomTimeWithinLastYear(today){
    function getRandomDate(from, to) {
      from = from.getTime();
      to = to.getTime();
      return new Date(from + Math.random() * (to - from));
    }
    var oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth());
    return getRandomDate(oneYearAgo, today);
  }
  for (var i = 0; i < NUMBER_OF_LOGS; i++){
    var flightNumber = Math.floor(Math.random() * NUMBER_OF_PLANES);
    var pType = planeType(flightNumber);
    var today = new Date();
    var log = {
      type: pickRandomElement(TYPES_OF_RED_DEFECTS.concat(TYPES_OF_ORANGE_DEFECTS)),
      flight_number: flightNumber,
      seat_number: Math.floor(Math.random() * pType.numberOfSeats),
      timestamp: pickRandomTimeWithinLastYear(today).getTime(),
      status: pickRandomElement(TYPES_OF_STATUS)
    };
    LOG_DATA.push(log);
  }
}

function generatePlaneData(){
  function getPlaneType(flightId){
    return PLANE_TYPES[flightId % PLANE_TYPES.length];
  }
  function getSeatId(r, c, planeType){
    return c + (r * planeType.columns);
  }
  function getRow(seatId, planeId){
    var planeType = getPlaneType(planeId);
    var row = Math.floor(seatId/planeType.columns);
    return row;
  }
  function getCol(seatId, planeId){
    var planeType = getPlaneType(planeId);
    return seatId % planeType.columns;
  }

  generateLogData();
  LOG_DATA.sort((a, b) => {
    return a.timestamp - b.timestamp;
  });
  for (var i = 0; i < NUMBER_OF_PLANES; i++){
    var planeType = getPlaneType(i);
    var seats = new Array(planeType.rows);
    for (var r = 0; r < planeType.rows; r++){
      seats[r] = new Array(planeType.columns);
      for (var c = 0; c < planeType.columns; c++){
        seats[r][c] = new Seat([], GREEN, planeType.aisleColumns.includes(c));
      }
    }
    PLANES.push(new Plane(i, getPlaneType(i), seats));
  }
  for (log of LOG_DATA){
    var planeId = log.flight_number;
    var seatId = log.seat_number;
    PLANES[planeId].seats[getRow(seatId, planeId)][getCol(seatId, planeId)].updateWith(log);
  }
}

function isFixed(datum){
  return datum.status === STATUS_FIXED
}

function isDefect(datum){
  return datum.status === STATUS_DEFECT
}

function getColor(seatId, flightId){
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
        if (latest && latest.time > datum.time){
          return latest;
        } else {
          return datum;
        }
      }, null);
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
    var latestLog = latest(seatHistoricalData);
    if (latestLog) {
      if (isDefect(latestLog)){
        return 1;
      }
      if (withinMonth(latestLog.time)){
        return 0;
      } else {
        return 0.5;
      }
    } else {
      return 0;
    }
  }

  function isGreen(score){
    return score === 0;
  }
  function isRed(score){
    return score === 1;
  }
  var score = getScore(flightId, seatId, LOG_DATA);
  if (isGreen(score)) return "GREEN";
  if (isRed(score)) return "RED";
  return "YELLOW";
}

function getDefects(seatId, flightId){
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
  var seatHistoricalData = data.filter(log => {
    return (isFlight(flight))(log) && (isSeat(seat))(log);
  });

}

/**
takes in flight number,
returns 2d array of seats
**/
function getFlight(flightId) {
  function getPlaneType(flightId){
    return PLANE_TYPES[flightId % PLANE_TYPES.length];
  }
  function getSeatId(r, c, planeType){
    return c + (r * planeType.columns);
  }
  var arr = [][];
  var planeType = getPlaneType(flightId);
  for (var r = 0; r < planeType.rows; r++){
    for (var c = 0; c < planeType.columns; c++){
      var seatId = getSeatId(r, c, planeType(flightId));
      var status = getColor(seatId, flightId);
      var defects = status === "GREEN" ? [] : getDefects(seatId, flightId);
      var isAisle = planeType.aisleColumns.includes(c);
      arr[r][c] = new Seat(defects, status, isAisle).toJson();
    }
  }
  return arr;
}

export default getColor
