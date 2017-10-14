import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <div>
        <nav>
          <ul>
            <li><Link to="/manage">Manage</Link></li>
            <li><Link to="/defect">Defect</Link></li>
          </ul>
        </nav>
      </div>
    )
  }
}

export default Home;
