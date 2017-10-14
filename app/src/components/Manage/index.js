import React, { Component } from "react";
import _ from "lodash";

class Manage extends Component {
  render() {
    return (
      <div>
        <h1>Flight defects</h1>
        <h2>Needs fixing</h2>
        <ul />
        <h2>Needs attention</h2>
      </div>
    );
  }
}

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
