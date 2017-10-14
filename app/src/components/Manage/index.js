import React, { Component } from "react";
import _ from "lodash";
import SeatMap from "../SeatMap";
import "./index.scss";

class Manage extends Component {
  renderFailures() {
    const failures = _.filter(data, { status: "failure" });
    return _.map(failures, (item, index) => (
      <li key={index}>
        {item.type}:{item.number}
      </li>
    ));
  }

  renderAttention() {
    const watch = _.filter(data, { status: "watch" });
    return _.map(watch, (item, index) => (
      <li key={index}>
        {item.type}:{item.number}
      </li>
    ));
  }

  renderRows() {
    return _.times(30, () => row);
  }

  render() {
    return (
      <div>
        <h1 className="title">Flight defects</h1>
        <div className="flex-container">
          <div className="col seatmap-col">
            <SeatMap rows={this.renderRows()} maxReservableSeats={0} />
          </div>
          <div className="col list-col">
            <div className="danger">
              <h2>Needs fixing</h2>
              <ul>{this.renderFailures()}</ul>
            </div>
            <div className="attention">
              <h2>Needs attention</h2>
              <ul>{this.renderAttention()}</ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const numberOfRows = 30;

const row = [
  { number: "A" },
  { number: "B" },
  { number: "C" },
  null,
  { number: "G" },
  { number: "H" },
  { number: "J" }
];

const data = [
  {
    type: "reclining seats",
    status: "failure",
    number: "3"
  },
  {
    type: "reclining seats",
    status: "watch",
    number: "1"
  },
  {
    type: "seat belt",
    status: "failure",
    number: "1"
  }
];

export default Manage;
