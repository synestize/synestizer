import React, { Component, PropTypes, Children } from 'react';

const DeviceSelect = ({
    disabled,
    currentDevice,
    onChange,
    deviceMap,
    name,
    title,
    valid=true}
  ) => {
  const optNodes = [];
  for (let [key, name] of deviceMap) {
    let nu = <option value={key} key={key}>{name}</option> ;
    optNodes.push(nu);
  }
  return <div className="devicechooserwidget">
    <label htmlFor={name}>{title}</label>
    <select name={name} id={name}
        className="deviceselect"
        disable={disabled}
        value={currentDevice}
        onChange={(ev)=>onChange(ev.target.value) } >
      {optNodes}
    </select>
  </div>
}

DeviceSelect.propTypes = {
  currentDevice: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  deviceMap: PropTypes.instanceOf(Map).isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  valid: PropTypes.bool,
  disabled: PropTypes.bool.isRequired
}

export default DeviceSelect
