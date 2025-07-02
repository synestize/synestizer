import React from 'react';

const Select = ({
    disabled=false,
    currentOpt,
    onChange,
    optDict,
    className="select",
    withNull=true,
  }
  ) => {
  const optNodes = [];
  if (withNull) {
    optNodes.push(<option value={undefined} key=""></option>)
  }
  for (let key in optDict) {
    let nu = <option value={key} key={key}>{optDict[key]}</option> ;
    optNodes.push(nu);
  }
  if (!withNull && currentOpt===undefined) {
    currentOpt = Object.keys(optDict)[0]
  }
  return (<select
      className={className}
      disabled={disabled}
      value={currentOpt}
      onChange={(ev)=>onChange(ev.target.value) } >
    {optNodes}
  </select>)
}


export default Select
