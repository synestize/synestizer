import React, { Component, PropTypes, Children } from 'react';

const Select = ({
    disabled=false,
    currentOpt,
    onChange,
    optDict,
    className="select",
  }
  ) => {
  const optNodes = [];
  for (let key in optDict) {
    let nu = <option value={key} key={key}>{optDict[key]}</option> ;
    optNodes.push(nu);
  }
  return (<div className={className+"-wrap"}>
    <select
        className={className}
        disabled={disabled}
        value={currentOpt}
        onChange={(ev)=>onChange(ev.target.value) } >
      {optNodes}
    </select>
  </div>)
}

Select.propTypes = {
  currentOpt: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  optDict: PropTypes.object.isRequired,
  disabled: PropTypes.bool
}

export default Select
