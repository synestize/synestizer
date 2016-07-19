import React, { Component, PropTypes, Children } from 'react';
import ActiveMidiCCControl from '../containers/ActiveMidiCCControl'
import ActiveMidiCCAdd from '../containers/ActiveMidiCCAdd'

const MidiCCSet = ({
    ccset,
    adder,
    swapper,
    remover,
    solocc,
    solotoggler
  }) => {
  const ccNodes = [];
  for (let cc of ccset) {
    ccNodes.push(<ActiveMidiCCControl
      remover={remover}
      swapper={swapper}
      ccset={ccset}
      key={cc}
      cc={cc}
      solotoggler={solotoggler}
      solocc={solocc} />);
  }
  return (<div className="ccset">
    {ccNodes}
    <ActiveMidiCCAdd adder={adder} />
  </div>)
}

MidiCCSet.propTypes = {
  ccset: PropTypes.array.isRequired,
  adder: PropTypes.func.isRequired,
  remover: PropTypes.func.isRequired,
  solocc: PropTypes.func,
  solocc: PropTypes.number
}

export default MidiCCSet
