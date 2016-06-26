import React, { Component, PropTypes, Children } from 'react';

const IntSelect = ({
    disabled,
    currentInt,
    onChange,
    onRemove,
    name,
    unavailable,
    max}
  ) => {
  const optNodes = [];
  /*
  for (let [key, name] of intMap) {
    let nu = <option value={key} key={key}>{name}</option> ;
    optNodes.push(nu);
  } */
  return <div className="intchooserwidget">
    <select name={name} id={name}
        className="intselect"
        disable={disabled}
        value={currentInt}
        onChange={(ev)=>onChange(ev.target.value) } >
      {optNodes}
    </select>
    <span>
  </div>
}

IntSelect.propTypes = {
  currentInt: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func,
  name: PropTypes.string.isRequired,
  unavailable: PropTypes.array,
  disabled: PropTypes.bool.isRequired
}

export default IntSelect
