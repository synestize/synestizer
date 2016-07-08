import React, { Component, PropTypes, Children } from 'react';
import ActiveMidiCCControl from '../containers/ActiveMidiCCControl'
import ActiveMidiCCAdd from '../containers/ActiveMidiCCAdd'

const MidiCCSet = ({
    ccset,
    adder,
    swapper,
    remover
  }) => {
  const ccNodes = [];
  for (let cc of ccset) {
    ccNodes.push(<ActiveMidiCCControl remover={remover} swapper={swapper} ccset={ccset} key={cc} cc={cc}/>);
  }
  return (<div className="ccset">
    {ccNodes}
    <ActiveMidiCCAdd adder={adder}/>
  </div>)
}

MidiCCSet.propTypes = {
  ccset: PropTypes.array.isRequired,
  adder: PropTypes.func.isRequired,
  remover: PropTypes.func.isRequired,
  swapper: PropTypes.func.isRequired,
}

export default MidiCCSet
