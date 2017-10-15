import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Link, Switch, Redirect, withRouter } from "react-router-dom";
import ReactTable from "react-table";
import _ from "lodash";
import moment from "moment";
import "./index.scss";
import Header from "../Header";

class Home extends Component {
  static propTypes = {
    flights: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className="home">
        <Header title="Upcoming Flights for Soekarno-Hatta International Airport (CGK),
        Jakarta, Indonesia" />
        <ReactTable
          data={this.props.flights}
          columns={[
            {
              Header: "Plane ID",
              accessor: "planeId"
            },
            {
              Header: "Flight Number",
              accessor: "flightNumber"
            },
            {
              Header: "Arrival",
              id: "arrival",
              accessor: data => {
                return moment(data.arrival).format("h:mm:ss a Do MMM YY");
              }
            },
            {
              Header: "Departure",
              id: "departure",
              accessor: data => {
                return moment(data.departure).format("h:mm:ss a Do MMM YY");
              }
            }
          ]}
          getTrProps={(state, rowInfo) => {
            return {
              onClick: e => {
                this.props.history.push({
                  pathname: `/manage/${rowInfo.original.planeId}`
                });
              }
            };
          }}
          defaultPageSize={5}
          showPagination={false}
        />
      </div>
    );
  }
}

export default withRouter(Home);
