import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link, Switch, Redirect, withRouter } from "react-router-dom";

import Login from "../components/Login";
import { loginUser } from "../components/Login/actions";
import Manage from "../components/Manage";
import Home from "../components/Home";
import "../style/index.scss";

// Mocks
const WillMatch = () => <h1>WillMatch</h1>;
const NoMatch = () => <h1>NoMatch</h1>;

class App extends Component {
  render() {
    const { dispatch, isAuthenticated, error } = this.props;
    return (
      <main>
        <div className="boxed">
          <div id="content-container">
            <Switch>
              <Route path="/" exact component={Home} />
              <Route
                path="/manage"
                render={() => <Manage flightData={flightData} />}
              />
              {/* <Route path="/defect" component={Defect} /> */}
              <Route component={NoMatch} />
            </Switch>
          </div>
        </div>
      </main>
    );
  }
}

function mapStateToProps(state) {
  const { auth } = state;
  const { isAuthenticated, error } = auth;

  return {
    isAuthenticated,
    error
  };
}

export default withRouter(connect(mapStateToProps)(App));

const flightData = [
  [
    {
      defects: [
        {
          type: "Reclining Seat",
          items: [{ "5mm Hex Bolt": 1 }],
          deferred: 1
        }
      ],
      aisle: false,
      status: "RED"
    },
    {
      aisle: false,
      status: "GREEN",
      defects: []
    },
    {
      aisle: false,
      status: "GREEN",
      defects: []
    },
    {
      aisle: true,
      status: "GREEN",
      defects: []
    },
    {
      aisle: false,
      status: "GREEN",
      defects: []
    },
    {
      aisle: false,
      status: "GREEN",
      defects: []
    },
    {
      aisle: false,
      status: "GREEN",
      defects: []
    }
  ],
  [
    {
      aisle: false,
      status: "GREEN",
      defects: []
    },
    {
      defects: [
        {
          type: "Tray Table",
          items: [{ Tray: 1 }],
          deferred: 0
        }
      ],
      aisle: false,
      status: "ORANGE"
    },
    {
      aisle: false,
      status: "GREEN",
      defects: []
    },
    {
      aisle: true,
      status: "GREEN",
      defects: []
    },
    {
      aisle: false,
      status: "GREEN",
      defects: []
    },
    {
      defects: [
        {
          type: "Tray Table",
          items: [{ Tray: 1 }],
          deferred: 0
        }
      ],
      aisle: false,
      status: "YELLOW"
    },
    {
      aisle: false,
      status: "GREEN",
      defects: []
    }
  ]
];
