import { connect } from 'react-redux';
import TriadControl from '../components/TriadControl.js'
import { union, difference, intersection } from '../lib/collections'
import {
  toggleTriadMute
} from '../actions/audio';

const mapStateToProps = (state, ownProps) => {
  return {
    mute: state.audio.triad.mute,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeMute: (val) => {
      dispatch(toggleTriadMute())
    },
  }
};

const ActiveTriadControl = connect(
  mapStateToProps,
  mapDispatchToProps
)( TriadControl );

export default ActiveTriadControl;
