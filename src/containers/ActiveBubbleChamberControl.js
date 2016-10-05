import { connect } from 'react-redux';
import BubbleChamberControl from '../components/BubbleChamberControl.js'
import { union, difference, intersection } from '../lib/collections'
import {
  toggleBubbleChamberMute
} from '../actions/audio';

const mapStateToProps = (state, ownProps) => {
  return {
    mute: state.audio.triad.mute,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeMute: (val) => {
      dispatch(toggleBubbleChamberMute())
    },
  }
};

const ActiveBubbleChamberControl = connect(
  mapStateToProps,
  mapDispatchToProps
)( BubbleChamberControl );

export default ActiveBubbleChamberControl;
