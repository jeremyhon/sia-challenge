import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link, Switch, Redirect, withRouter } from "react-router-dom";

import Login from "../components/Login";
import { loginUser } from "../components/Login/actions";
import NavBar from "../components/NavBar";
import Users from "../components/Users";
import Home from "../components/Home";

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
              <Route path="/manage" component={Users} />
              <Route path="/defect" component={Users} />
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
