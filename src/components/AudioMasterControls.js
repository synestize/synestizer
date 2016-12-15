import MasterAudioGain from '../containers/MasterAudioGain'
import ActiveAudioMasterTempo from '../containers/ActiveAudioMasterTempo'
import ActiveRecordWidget from '../containers/ActiveRecordWidget'
import React, { Component, PropTypes } from 'react'

const AudioMasterControls = function(props) {
  return (<div className="subpane">
    <MasterAudioGain />
    <ActiveAudioMasterTempo />
    {/* <ActiveRecordWidget /> */}
  </div>)
};

export default AudioMasterControls
