import React from 'react';

const DeviceSelect = ({
    disabled=false,
    currentDevice,
    onChange,
    deviceMap,
    valid=true,
    withNull=true}
  ) => {
  const optNodes = [];
  for (let [key, name] of Object.entries(deviceMap)) {
    let nu = <option value={key} key={key}>{name}</option> ;
    optNodes.push(nu);
  }
  return (<div className="devicechooserwidget">
    <select
        className="deviceselect"
        disabled={disabled}
        value={currentDevice}
        onChange={(ev)=>onChange(ev.target.value)}>
      {optNodes}
    </select>
  </div>)
}


export default DeviceSelect
