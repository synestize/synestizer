import React, { Component, PropTypes, Children } from 'react';
import SpecificAudioParam from '../containers/SpecificAudioParam'

const EnsembleTriad = ({
  }) => {
  return (<div className="audioControlset">
    <SpecificAudioParam sinkControlKey='triad|pitch-0001' />
    <SpecificAudioParam sinkControlKey='triad|pitch-0002' />
    <SpecificAudioParam sinkControlKey='triad|pitch-0003' />
    <SpecificAudioParam sinkControlKey='triad|bottom' />
    <SpecificAudioParam sinkControlKey='triad|gate' />
    <SpecificAudioParam sinkControlKey='triad|arprate' />
    <SpecificAudioParam sinkControlKey='triad|retriggerinterval' />
    <SpecificAudioParam sinkControlKey='triad|gain' />
  </div>)
}

EnsembleTriad.propTypes = {
}

export default EnsembleTriad
