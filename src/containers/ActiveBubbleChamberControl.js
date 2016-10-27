import { connect } from 'react-redux';
import BubbleChamberControl from '../components/BubbleChamberControl.js'
import { union, difference, intersection } from '../lib/collections'
import {
  toggleBubbleChamberVoice1Mute,
  toggleBubbleChamberVoice2Mute,
  toggleBubbleChamberVoice3Mute,
  toggleBubbleChamberVoice4Mute,
} from '../actions/audio';

const mapStateToProps = (state, ownProps) => {
  return {
    voice1mute: state.audio.bubbleChamber.voice1.mute,
    voice2mute: state.audio.bubbleChamber.voice2.mute,
    voice3mute: state.audio.bubbleChamber.voice3.mute,
    bassmute: state.audio.bubbleChamber.bass.mute,
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
  }
};

const ActiveBubbleChamberControl = connect(
  mapStateToProps,
  mapDispatchToProps
)( BubbleChamberControl );

export default ActiveBubbleChamberControl;
