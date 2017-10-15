import React, { Component } from "react";
import _ from "lodash";
import moment from "moment";
import "./index.scss";

class Defect extends Component {
  render() {
    return (
      <div className="defect">
        <h2>Defect Details</h2>
        <div className="flex-container">
          {_.map(data, (datum, idx) => {
            return <LineItem {...datum} key={idx} />;
          })}
          <span className="line-item">
            <div className="left-align">
              <strong>Photo:</strong>&nbsp;
            </div>
            <div className="left-align">
              <img src="https://media.consumeraffairs.com/files/cache/reviews/united-airlines_12095_thumbnail.JPG" />
            </div>
          </span>
        </div>
      </div>
    );
  }
}

const LineItem = ({ name, desc }) => {
  return (
    <span className="line-item">
      <div className="left-align">
        <strong>{name}:</strong>&nbsp;
      </div>
      <div className="left-align">
        <span>{desc}</span>
      </div>
    </span>
  );
};

const data = [
  { name: "Defect Type", desc: "Tray Table" },
  { name: "Defect Status", desc: "Minor" },
  { name: "Plane ID", desc: "2" },
  {
    name: "Reported Time",
    desc: moment().format("h:mm:ss a Do MMM YY")
  },
  { name: "Reported By", desc: "Stella Ng" },
  {
    name: "Detailed Description",
    desc: "Broken Tray Table, probably requires replacement"
  }
];

export default Defect;
