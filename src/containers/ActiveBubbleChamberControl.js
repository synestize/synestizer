import { connect } from 'react-redux';
import BubbleChamberControl from '../components/BubbleChamberControl.js'
import { union, difference, intersection } from '../lib/collections'
import {
  toggleBubbleChamberVoice1Mute,
  toggleBubbleChamberVoice2Mute,
  toggleBubbleChamberVoice3Mute,
  toggleBubbleChamberVoice4Mute,
  setVoice1Sample,
  setVoice2Sample,
  setVoice3Sample,
} from '../actions/audio';

const mapStateToProps = (state, ownProps) => {
  return {
    voice1mute: state.audio.bubbleChamber.voice1.mute,
    voice2mute: state.audio.bubbleChamber.voice2.mute,
    voice3mute: state.audio.bubbleChamber.voice3.mute,
    bassmute: state.audio.bubbleChamber.bass.mute,
    voice1sample: state.audio.bubbleChamber.voice1.sample,
    voice2sample: state.audio.bubbleChamber.voice2.sample,
    voice3sample: state.audio.bubbleChamber.voice3.sample,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeVoice1Mute: (val) => {
      dispatch(toggleBubbleChamberVoice1Mute())
    },
    onChangeVoice2Mute: (val) => {
      dispatch(toggleBubbleChamberVoice2Mute())
    },
    onChangeVoice3Mute: (val) => {
      dispatch(toggleBubbleChamberVoice3Mute())
    },
    onChangeBassMute: (val) => {
      dispatch(toggleBubbleChamberVoice4Mute())
    },
    onChangeVoice1Sample: (val) => {
      dispatch(setVoice1Sample(val))
    },
    onChangeVoice2Sample: (val) => {
      dispatch(setVoice2Sample(val))
    },
    onChangeVoice3Sample: (val) => {
      dispatch(setVoice3Sample(val))
    },
  }
};

const ActiveBubbleChamberControl = connect(
  mapStateToProps,
  mapDispatchToProps
)( BubbleChamberControl );

export default ActiveBubbleChamberControl;
