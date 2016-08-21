import React, { Component, PropTypes, Children } from 'react';

const IntSelect = ({
    currentNum=0,
    onChange,
    unavailable,
    disabled=false,
    minNum=0,
    maxNum}
  ) => {
  const optNodes = [];
  unavailable = new Set(unavailable ? unavailable : []);
  for (let idx=minNum;idx<maxNum; idx++) {
    let nu = <option
      value={idx}
      key={idx}
      disabled={unavailable.has(idx)} >
        {idx}
    </option> ;
    optNodes.push(nu);
  }
  return (<select
      className="intselect"
      disabled={disabled}
      value={currentNum}
      onChange={ (ev) => onChange(parseInt(ev.target.value))} >
    {optNodes}
  </select>)
}

IntSelect.propTypes = {
  currentNum: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  unavailable: PropTypes.array,
  disabled: PropTypes.bool,
  maxNum: PropTypes.number,
  minNum: PropTypes.number,
}

export default IntSelect
