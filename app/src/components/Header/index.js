import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./index.scss";

class Header extends Component {
  render() {
    return (
      <header>
        <button
          className="back-btn btn"
          onClick={() => {
            this.props.history.goBack();
          }}
        >
          Back
        </button>
        <h3 className="title">{this.props.title}</h3>
      </header>
    );
  }
}

export default withRouter(Header);
