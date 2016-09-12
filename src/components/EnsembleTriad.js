import React, { Component, PropTypes, Children } from 'react';
import SpecificAudioParam from '../containers/SpecificAudioParam'

const EnsembleTriad = ({
  }) => {
  return (<div className="audioControlset">
    <SpecificAudioParam sinkControlKey='triad|pitch-0001' />
    <SpecificAudioParam sinkControlKey='triad|pitch-0002' />
    <SpecificAudioParam sinkControlKey='triad|pitch-0003' />
    <SpecificAudioParam sinkControlKey='triad|octave-bottom' />
    <SpecificAudioParam sinkControlKey='triad|octave-range' />
    <SpecificAudioParam sinkControlKey='triad|gate' />
  </div>)
}

EnsembleTriad.propTypes = {
}

export default EnsembleTriad
