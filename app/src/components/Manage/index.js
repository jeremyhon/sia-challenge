import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import SeatMap from "../SeatMap";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./index.scss";
import HeaderCheckBox, { CellCheckBox } from "./Checkbox";

class Manage extends Component {
  static propTypes = {
    flights: PropTypes.array.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    }).isRequired
  };

  componentWillMount = () => {
    const flight = this.props.flights[this.props.match.params.id];
    const defects = defectData(flight.seats);
    this.setState({
      defects,
      seats: flight.seats,
      items: [],
      checked: []
    });
  };

  state = {};

  handleRowCheck = rowInfo => () => {
    const defects = _.map(this.state.defects, defect => {
      if (defect.id === rowInfo.original.id) {
        return _.assign({}, defect, { checked: !defect.checked });
      }
      return defect;
    });
    this.setState({ defects });
  };

  renderRows() {
    return _.map(this.state.seats, row => {
      const rowLength = row.length;
      const mapping = _.find(seatMappings, { length: rowLength }).mapping;
      return _.map(row, (seat, index) => {
        if (seat.isAisle) {
          return null;
        }

        return {
          number: mapping[index],
          className: _.toLower(seat.status)
        };
      });
    });
  }

  getItems() {
    // concat items into one array
    let items = [];
    _.each(this.state.defects, defect => {
      if (defect.checked) {
        _.each(defect.items, item => {
          items = _.concat(items, item);
        });
      }
    });
    // merge items together by quantity
    items = _.assignWith({}, ...items, (objValue, srcValue) => {
      if (_.isNumber(objValue)) {
        return objValue + srcValue;
      }
      return srcValue;
    });
    // convert into table format
    return _.map(items, (qty, name) => ({ name, qty }));
  }

  handleHeaderCheck() {
    const checked = this.isAllChecked();
    const defects = _.map(this.state.defects, defect => {
      return _.assign({}, defect, { checked: !checked });
    });
    return this.setState({
      isAllChecked: !checked,
      defects
    });
  }

  isAllChecked() {
    const res = _.every(this.state.defects, { checked: true });
    return res;
  }

  render() {
    const isAllChecked = this.isAllChecked();
    return (
      <div>
        <h1 className="title">Flight defects</h1>
        <div className="flex-container">
          <div className="col seatmap-col">
            <SeatMap rows={this.renderRows()} maxReservableSeats={0} />
          </div>
          <div className="col defect-col">
            <h2>Defects</h2>
            <ReactTable
              data={this.state.defects}
              columns={[
                {
                  Header: "Type",
                  accessor: "type"
                },
                {
                  Header: "Location",
                  accessor: "location",
                  maxWidth: 50
                },
                {
                  Header: "Times Deferred",
                  accessor: "deferred",
                  maxWidth: 50
                },
                {
                  Header: "Status",
                  id: "status",
                  accessor: data => {
                    switch (data.status) {
                      case "RED":
                        return "Major";
                      case "ORANGE":
                        return "Minor";
                      case "YELLOW":
                        return "Pending";
                    }
                  }
                },
                {
                  Header: HeaderCheckBox,
                  accessor: "",
                  Cell: CellCheckBox,
                  maxWidth: 50,
                  getHeaderProps: () => {
                    return {
                      onClick: this.handleHeaderCheck.bind(this),
                      checked: isAllChecked
                    };
                  },
                  getProps: (state, rowInfo) => {
                    if (rowInfo) {
                      return {
                        checked: rowInfo.original.checked,
                        onClick: this.handleRowCheck(rowInfo)
                      };
                    }
                    return {};
                  }
                }
              ]}
              getTrProps={(state, rowInfo) => {
                return {
                  className: _.toLower(_.get(rowInfo, "original.status"))
                };
              }}
            />
          </div>
          <div className="col items-col">
            <h2>Items</h2>
            <ReactTable
              data={this.getItems()}
              columns={[
                { Header: "Name", accessor: "name" },
                { Header: "Qty", accessor: "qty" }
              ]}
            />
          </div>
        </div>
      </div>
    );
  }
}

const seatMappings = [
  {
    length: 7,
    mapping: ["A", "B", "C", "", "D", "E", "F"]
  },
  {
    length: 5,
    mapping: ["A", "C", "", "D", "F"]
  },
  {
    length: 12,
    mapping: ["A", "B", "C", "", "D", "E", "F", "G", "", "H", "J", "K"]
  }
];

function defectData(flightData) {
  let defectData = [];
  const rowLength = flightData[0].length;
  const mapping = _.find(seatMappings, { length: rowLength }).mapping;
  _.each(flightData, (row, rowNumber) => {
    _.each(row, ({ aisle, defect }, seatNumber) => {
      if (aisle) {
        return;
      }
      const seatLetter = mapping[seatNumber];
      const defectsWithLocation = _.map(defect, eachDefect => {
        return _.assign({}, eachDefect, {
          location: `${rowNumber + 1}${seatLetter}`
        });
      });
      defectData = _.concat(defectData, defectsWithLocation);
    });
  });
  defectData = _.map(defectData, (defectDatum, id) => {
    defectDatum.id = id;
    return defectDatum;
  });
  return defectData;
}

export default Manage;
