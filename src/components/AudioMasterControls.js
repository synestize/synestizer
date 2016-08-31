import * as transform from '../lib/transform'
import AudioMasterGain from '../containers/AudioMasterGain'
import AudioMasterTempo from '../containers/AudioMasterTempo'

const AudioMasterControls = function(props) {
  return (<div className="audiocontrolset">
    <AudioMasterGain />
    <AudioMasterTempo />
  </div>)
};

export default AudioMasterControls
