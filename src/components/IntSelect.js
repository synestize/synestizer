import React, { Component, PropTypes, Children } from 'react';

const IntSelect = ({
    currentNum=0,
    onChange,
    name,
    unavailable,
    disabled=false,
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
        value={currentNum}
        onChange={(ev)=>onChange(ev.target.value) } >
      {optNodes}
    </select>
  </div>
}

IntSelect.propTypes = {
  currentNum: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  unavailable: PropTypes.array,
  disabled: PropTypes.bool,
  maxInt: PropTypes.number,
  minInt: PropTypes.number,
}

export default IntSelect
