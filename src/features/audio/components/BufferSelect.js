import React from 'react';
import { useSelector } from 'react-redux';

const BufferSelect = ({ 
  withNull = false, 
  currentOpt, 
  onChange, 
  disabled = false, 
  className = "select" 
}) => {
  const sampleBank = useSelector(state => state.audio.sampleBank);
  
  const optDict = {};
  let keys = Array.from(Object.keys(sampleBank)).sort();
  for (let key of keys) {
    optDict[key] = sampleBank[key].name;
  }

  const optNodes = [];
  if (withNull) {
    optNodes.push(<option value={undefined} key=""></option>);
  }
  for (let key in optDict) {
    let nu = <option value={key} key={key}>{optDict[key]}</option>;
    optNodes.push(nu);
  }
  
  let effectiveCurrentOpt = currentOpt;
  if (!withNull && currentOpt === undefined) {
    effectiveCurrentOpt = Object.keys(optDict)[0];
  }

  return (
    <select
      className={className}
      disabled={disabled}
      value={effectiveCurrentOpt}
      onChange={(ev) => onChange(ev.target.value)}
    >
      {optNodes}
    </select>
  );
};

export default BufferSelect;