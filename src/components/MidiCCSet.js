import React, { Component, PropTypes, Children } from 'react';
import ActiveMidiCCControl from '../containers/ActiveMidiCCControl'
import ActiveMidiCCAdd from '../containers/ActiveMidiCCAdd'

const MidiCCSet = ({
    ccset,
    adder,
    remover,
    unknownadder,
    solocc,
    solotoggler
  }) => {
  const ccNodes = [];
  for (let cc of ccset) {
    ccNodes.push(<ActiveMidiCCControl
      remover={remover}
      ccset={ccset}
      adder={adder}
      key={cc}
      cc={cc}
      solotoggler={solotoggler}
      solocc={solocc} />);
  }
  return (<div className="ccset">
    {ccNodes}
    <ActiveMidiCCAdd adder={unknownadder} />
  </div>)
}

MidiCCSet.propTypes = {
  ccset: PropTypes.array.isRequired,
  adder: PropTypes.func.isRequired,
  remover: PropTypes.func.isRequired,
  unknownadder: PropTypes.func.isRequired,
  solotoggler: PropTypes.func,
  solocc: PropTypes.number
}

export default MidiCCSet
