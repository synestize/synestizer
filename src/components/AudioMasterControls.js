import MasterAudioGain from '../features/audio/components/MasterAudioGain'
import ActiveAudioMasterTempo from '../features/audio/components/ActiveAudioMasterTempo'
import ActiveRecordWidget from '../features/audio/components/ActiveRecordWidget'
import React from 'react'

const AudioMasterControls = function(props) {
  return (<div className="subpane">
    <MasterAudioGain />
    <ActiveAudioMasterTempo />
    {/* <ActiveRecordWidget /> */}
  </div>)
};

export default AudioMasterControls
