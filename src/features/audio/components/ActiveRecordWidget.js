import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { record, setRecordBuffer } from '../../../actions/audio';
import RecordWidget from '../../../components/RecordWidget';

const ActiveRecordWidget = () => {
  const dispatch = useDispatch();
  
  const sampleBank = useSelector(state => state.audio.sampleBank);
  const recordSlot = useSelector(state => state.__volatile.audio.record.recordBuffer);
  const isRecording = useSelector(state => state.__volatile.audio.record.recording);

  // Filter record slots (those starting with '_')
  const recordSlots = {};
  let keys = Array.from(Object.keys(sampleBank)).sort();
  for (let key of keys) {
    if (key.startsWith('_')) {
      recordSlots[key] = sampleBank[key].name;
    }
  }

  const handleChangeSlot = (val) => {
    dispatch(setRecordBuffer(val));
  };

  const handleRecord = () => {
    dispatch(record(true));
  };

  return (
    <RecordWidget
      recordSlots={recordSlots}
      recordSlot={recordSlot}
      isRecording={isRecording}
      onChangeSlot={handleChangeSlot}
      onRecord={handleRecord}
    />
  );
};

export default ActiveRecordWidget;