import React from "react";

export const CellCheckBox = props => {
  const { checked, onClick } = props.columnProps.rest;
  return (
    <div className="checkbox">
      <label>
        <input type="checkbox" checked={checked} onChange={onClick} />
      </label>
    </div>
  );
};

const HeaderCheckBox = props => {
  const { checked, onClick } = props.column.getHeaderProps();
  return (
    <div className="checkbox">
      <label>
        <input type="checkbox" checked={checked} onChange={onClick} />
      </label>
    </div>
  );
};

export default HeaderCheckBox;
