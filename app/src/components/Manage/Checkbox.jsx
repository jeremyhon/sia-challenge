import React from "react";

export const CellCheckBox = props => {
  const { checked, onClick } = props.columnProps.rest;
  return <CheckBox checked={checked} onClick={onClick} />;
};

const HeaderCheckBox = props => {
  const { checked, onClick } = props.column.getHeaderProps();
  return <CheckBox checked={checked} onClick={onClick} />;
};

const CheckBox = ({ checked, onClick }) => (
  <div className="table-checkbox">
    <label>
      <input type="checkbox" checked={checked} onChange={onClick} />
    </label>
  </div>
);

export default HeaderCheckBox;
