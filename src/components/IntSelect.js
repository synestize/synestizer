import React, { Component, PropTypes, Children } from 'react';

const IntSelect = ({
    disabled,
    currentInt,
    onChange,
    name,
    unavailable,
    minInt=0,
    maxInt}
  ) => {
  const optNodes = [];
  unavailable = new Set(unavailable ? unavailable : []);
  for (let idx=minInt;idx<maxInt; idx++) {

    let nu = <option
      value={idx}
      key={idx}
      disable={unavailable.has(idx)} >
        {idx}
    </option> ;
    optNodes.push(nu);
  }
  return <div className="intchooserwidget">
    <select name={name} id={name}
        className="intselect"
        disable={disabled}
        value={currentInt}
        onChange={(ev)=>onChange(ev.target.value) } >
      {optNodes}
    </select>
  </div>
}

IntSelect.propTypes = {
  currentInt: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  unavailable: PropTypes.array,
  disabled: PropTypes.bool.isRequired
}

export default IntSelect
