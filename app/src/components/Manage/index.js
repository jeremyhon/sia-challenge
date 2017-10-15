import React, { Component } from "react";
import _ from "lodash";
import SeatMap from "../SeatMap";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./index.scss";
import CheckBox from "./Checkbox";

class Manage extends Component {
  state = {
    defects: [],
    items: []
  };

  componentDidMount() {
    this.setState(prevState => {
      const defects = defectData();
      return {
        items: this.itemData(defects),
        defects
      };
    });
  }

  renderFailures() {
    const failures = _.filter(data, { status: "failure" });
    return _.map(failures, (item, index) => (
      <li key={index}>
        {item.type}:{item.number}
      </li>
    ));
  }

  renderAttention() {
    const watch = _.filter(data, { status: "watch" });
    return _.map(watch, (item, index) => (
      <li key={index}>
        {item.type}:{item.number}
      </li>
    ));
  }

  renderRows() {
    return _.map(flightData, row => {
      const rowLength = row.length;
      const mapping = _.find(seatMappings, { length: rowLength }).mapping;
      return _.map(row, (seat, index) => {
        if (seat.aisle) {
          return null;
        }
        return {
          number: mapping[index],
          className: _.toLower(seat.status)
        };
      });
    });
  }

  itemData(defectData) {
    // concat items into one array
    let items = [];
    _.each(defectData, defect => {
      _.each(defect.items, item => {
        items = _.concat(items, item);
      });
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

  render() {
    const items = this.itemData(this.state.defects);
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
                  accessor: "location"
                },
                {
                  Header: "Times Deferred",
                  accessor: "deferred"
                },
                {
                  Header: CheckBox,
                  accessor: "",
                  Cell: CheckBox
                }
              ]}
              getTrProps={(state, rowInfo, column, instance) => {
                return {
                  className: _.toLower(_.get(rowInfo, "original.status"))
                };
              }}
            />
          </div>
          <div className="col items-col">
            <h2>Items</h2>
            <ReactTable
              data={this.state.items}
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

function defectData() {
  let defectData = [];
  const rowLength = flightData[0].length;
  const mapping = _.find(seatMappings, { length: rowLength }).mapping;
  _.each(flightData, (row, rowNumber) => {
    _.each(row, ({ aisle, defects, status }, seatNumber) => {
      if (aisle) {
        return;
      }
      const seatLetter = mapping[seatNumber];
      const defectsWithLocation = _.map(defects, defect => {
        return _.assign({}, defect, {
          status,
          location: `${rowNumber + 1}${seatLetter}`
        });
      });
      defectData = _.concat(defectData, defectsWithLocation);
    });
  });
  return defectData;
}

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

const seat = {
  aisle: false,
  defect: "Reclining Seat",
  status: "RED",
  timesDeferred: 1,
  itemsRequired: [{ "5mm Hex Bolt": 1 }]
};

const numberOfRows = 30;

const row = [
  { number: "A" },
  { number: "B" },
  { number: "C" },
  null,
  { number: "G" },
  { number: "H" },
  { number: "J" }
];

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
