import { connect } from 'react-redux';
import { record, setRecordBuffer } from '../actions/audio';
import RecordWidget from '../components/RecordWidget';

const mapStateToProps = (state, ownProps) => {
  const recordSlots = {}
  let keys = Array.from(Object.keys(state.audio.sampleBank)).sort();
  for (let key of keys) {
    if (key.startsWith('_')) {
      recordSlots[key] = state.audio.sampleBank[key].name
    }
  }
  return {
    recordSlots: recordSlots,
    recordSlot: state.__volatile.audio.record.recordBuffer,
    isRecording: state.__volatile.audio.record.recording,
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeSlot: (val) => {
      dispatch(setRecordBuffer(val))
    },
    onRecord: () => dispatch(record(true)),
  }
};

const ActiveRecordWidget = connect(
  mapStateToProps,
  mapDispatchToProps
)( RecordWidget );

export default ActiveRecordWidget;
