import * as transform from '../lib/transform'
import ActiveAudioMasterGain from '../containers/ActiveAudioMasterGain'
import ActiveAudioMasterTempo from '../containers/ActiveAudioMasterTempo'

const AudioMasterControls = function(props) {
  return (<div className="audiocontrolset">
    <ActiveAudioMasterGain />
    <ActiveAudioMasterTempo />
  </div>)
};

export default AudioMasterControls
