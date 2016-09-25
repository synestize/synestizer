import * as transform from '../lib/transform'
import MasterAudioGain from '../containers/MasterAudioGain'
import ActiveAudioMasterTempo from '../containers/ActiveAudioMasterTempo'

const AudioMasterControls = function(props) {
  return (<div className="audiocontrolset">
    <MasterAudioGain />
    <ActiveAudioMasterTempo />
  </div>)
};

export default AudioMasterControls
