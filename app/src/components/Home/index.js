import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
import ReactTable from "react-table";
import "./index.scss";

class Home extends Component {
  static propTypes = {
    getPlane: PropTypes.func.isRequired
  };

  state = {
    flights: _.times(5, this.props.getPlane(_.random(0, 1000)))
  };

  render() {
    return (
      <div className="home">
        <h3>
          Upcoming Flights for Soekarno-Hatta International Airport (CGK),
          Jakarta, Indonesia
        </h3>
        <ReactTable />
      </div>
    );
  }
}

export default Home;
