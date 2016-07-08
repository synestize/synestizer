import React, { Component, PropTypes, Children } from 'react';
import ActiveMidiCCControl from '../containers/ActiveMidiCCControl'

const MidiCCSet = ({
    ccset,
    adder,
    swapper,
    remover
  }) => {
  const ccNodes = [];
  for (let cc of ccset) {
    ccNodes.push(<ActiveMidiCCControl adder={adder} remove={remover} swapper={swapper} ccset={ccset} />);
  }
  return (<div className="ccset">
    {ccNodes}
  </div>)
}

MidiCCSet.propTypes = {
  ccset: PropTypes.array.isRequired,
  adder: PropTypes.func.isRequired,
  remover: PropTypes.func.isRequired,
  swapper: PropTypes.func.isRequired,
}

export default MidiCCSet
