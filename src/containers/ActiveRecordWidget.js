import { connect } from 'react-redux';
import { record, recordBuffer } from '../actions/audio';
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
    recordSlots,
    recordSlot: state.__volatile.audio.record.recordBuffer,
    recording: state.__volatile.audio.record.record,
    withNull: false,
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeSlot: (val) => {
      dispatch(recordBuffer(val))
    },
    onRecord: () => dispatch(record(true)),
  }
};

const ActiveRecordWidget = connect(
  mapStateToProps,
  mapDispatchToProps
)( RecordWidget );

export default ActiveRecordWidget;
