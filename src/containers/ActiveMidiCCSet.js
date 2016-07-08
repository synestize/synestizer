'use strict';
import { connect } from 'react-redux';
import MidiCCSet from '../components/MidiCCSet.js'

const mapStateToProps = (state, ownProps) => {
  return {
    ccset: ownProps.ccset,
  }
};

const ActiveMidiCCSet = connect(
  mapStateToProps,
)( MidiCCSet );

export default ActiveMidiCCSet;
