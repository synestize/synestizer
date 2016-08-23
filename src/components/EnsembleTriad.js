import React, { Component, PropTypes, Children } from 'react';
import GenericAudioParam from '../containers/GenericAudioParam'

const EnsembleTriad = ({
    audioControlset,
    adder,
    remover,
    unknownadder,
    soloaudioControl,
    solotoggler
  }) => {
  const audioControlNodes = [];
  for (let audioControl of audioControlset) {
    audioControlNodes.push(<GenericAudioParam
      remover={remover}
      audioControlset={audioControlset}
      adder={adder}
      key={audioControl}
      audioControl={audioControl}
      solotoggler={solotoggler}
      soloaudioControl={soloaudioControl} />);
  }
  return (<div className="audioControlset">
    {audioControlNodes}
  </div>)
}

EnsembleTriad.propTypes = {
  audioControlset: PropTypes.array.isRequired,
  adder: PropTypes.func.isRequired,
  remover: PropTypes.func.isRequired,
  unknownadder: PropTypes.func.isRequired,
  solotoggler: PropTypes.func,
  soloaudioControl: PropTypes.number
}

export default EnsembleTriad
