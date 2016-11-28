import React, { Component, PropTypes, Children } from 'react';
import Icon from '../components/Icon'
import Select from '../components/Select'

const RecordWidget = ({
    onRecord,
    recordSlots,
    isRecording,
    recordSlot,
    onChangeSlot
  }) => {
  return (<div className="generic-audio-widget record-widget" >
    <Icon
      name="circle"
      onClick={()=>onRecord(!isRecording)}
      className={(isRecording ? 'recording' : '') + ' record-button'}/>
    <Select
      optDict={recordSlots}
      currentOpt={recordSlot}
      onChange={onChangeSlot}
      withNull={false}
    />
  </div>)
};

RecordWidget.propTypes = {
  recordSlots: PropTypes.object.isRequired,
  recordSlot: PropTypes.string.isRequired,
  onRecord: PropTypes.func.isRequired,
  onChangeSlot: PropTypes.func.isRequired,
  isRecording: PropTypes.bool.isRequired,
}

export default RecordWidget
