import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./index.scss";

class Header extends Component {
  render() {
    return (
      <header>
        <div className="back-btn">
          <span className="glyphicon glyphicon-arrow-left"
          onClick={() => {
            this.props.history.goBack();
          }}/>

        </div>

        <div className="centeredLogo">
          <div className="logoImage">
            <img src="https://farm1.nzstatic.com/_proxy/imageproxy_1y/serve/singapore-airline-logo.jpg?outputformat=jpg&quality=50&source=3198119&transformationsystem=letterbox&width=600&securitytoken=CFF99CA43D30F5203B82F5ECA07CA934" height="50px"/>
          </div>
          <div className="logoText">
            <h1 className="title">Defect Detective</h1>
          </div>
        </div>
      </header>
    );
  }
}

export default withRouter(Header);
