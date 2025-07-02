import React from 'react';
import ActiveMidiCCControl from '../features/midi/components/ActiveMidiCCControl'
import ActiveMidiCCAdd from '../features/midi/components/ActiveMidiCCAdd'

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


export default MidiCCSet
