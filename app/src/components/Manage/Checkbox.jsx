import React from "react";

const CheckBox = ({ checked, onClick }) => (
  <div className="checkbox">
    <label>
      <input type="checkbox" checked={checked} onChange={onClick} />
    </label>
  </div>
);

export default CheckBox;
