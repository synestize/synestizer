import * as transform from '../lib/transform'
import GenericAudioParam from './GenericAudioParam'

export default const AudioMasterControls = function(props) {
  return (<div className="audiocontrolset">
    <GenericAudioParam
      label="Tempo"
      median={props.medianMasterTempo}
      perturbation={props.perturbationMasterTempo}
      actual={props.actualMasterTempo}
      action={intents.setMedianMasterTempo}
      address="master-tempo"
      />
    <GenericAudioParam
      label="Base F"
      median={props.medianBaseFreq}
      perturbation={props.perturbationBaseFreq}
      actual={props.actualBaseFreq}
      action={intents.setMedianBaseFreq}
      address="base-freq"
      />
  </div>)
};
