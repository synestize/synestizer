import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

const ComboSignalSelect = ({ 
  sinkControlKey, 
  onSignalChange, 
  className = "select", 
  withNull = true, 
  disabled = false 
}) => {
  const comboSignalMeta = useSelector(state => state.signal.comboSignalMeta);
  const currentSignal = useSelector(state => 
    (state.audio.sinkControls[sinkControlKey] || {}).signal
  );

  const optDict = useMemo(() => {
    const dict = {};
    let keys = Array.from(Object.keys(comboSignalMeta)).sort();
    for (let key of keys) {
      dict[key] = (
        comboSignalMeta[key].owner + '/' + comboSignalMeta[key].name
      );
    }
    return dict;
  }, [comboSignalMeta]);

  const optNodes = [];
  if (withNull) {
    optNodes.push(<option value={undefined} key=""></option>);
  }
  for (let key in optDict) {
    let nu = <option value={key} key={key}>{optDict[key]}</option>;
    optNodes.push(nu);
  }

  let effectiveCurrentOpt = currentSignal;
  if (!withNull && currentSignal === undefined) {
    effectiveCurrentOpt = Object.keys(optDict)[0];
  }

  return (
    <select
      className={className}
      disabled={disabled}
      value={effectiveCurrentOpt}
      onChange={(ev) => onSignalChange(ev.target.value)}
    >
      {optNodes}
    </select>
  );
};

export default ComboSignalSelect;