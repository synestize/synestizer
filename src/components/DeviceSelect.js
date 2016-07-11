import React, { Component, PropTypes, Children } from 'react';

const DeviceSelect = ({
    disabled=false,
    currentDevice,
    onChange,
    deviceMap,
    valid=true}
  ) => {
  const optNodes = [];
  for (let [key, name] of deviceMap) {
    let nu = <option value={key} key={key}>{name}</option> ;
    optNodes.push(nu);
  }
  return (<div className="devicechooserwidget">
    <select
        className="deviceselect"
        disable={disabled}
        value={currentDevice}
        onChange={(ev)=>onChange(ev.target.value) } >
      {optNodes}
    </select>
  </div>)
}

DeviceSelect.propTypes = {
  currentDevice: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  deviceMap: PropTypes.instanceOf(Map).isRequired,
  valid: PropTypes.bool,
  disabled: PropTypes.bool
}

export default DeviceSelect
