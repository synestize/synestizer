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
  return (<div className="record-widget" >
    <Icon name="circle" onClick={onRecord} />
    <Select
      optDict={recordSlots}
      currentOpt={recordSlot}
      onChange={onChangeSlot}
    />
  </div>)
};

RecordWidget.propTypes = {
  recordSlots: PropTypes.object,
  recordSlot: PropTypes.string.required,
  onRecord: PropTypes.func.isRequired,
  onChangeSlot: PropTypes.func.isRequired,
  isRecording: PropTypes.bool.isRequired,
}

export default RecordWidget
