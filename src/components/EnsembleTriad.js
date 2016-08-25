import React, { Component, PropTypes, Children } from 'react';
import SpecificAudioParam from '../containers/SpecificAudioParam'

const EnsembleTriad = ({
  }) => {
  return (<div className="audioControlset">
    <SpecificAudioParam sinkControlKey='audio|triad|pitch-0001' />
    <SpecificAudioParam sinkControlKey='audio|triad|pitch-0002' />
  </div>)
}

EnsembleTriad.propTypes = {
}

export default EnsembleTriad
