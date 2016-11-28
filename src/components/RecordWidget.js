import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'
import Icon from '../components/Icon'
import Select from '../components/Icon'

const RecordWidget = ({
    onRecord,
    recordSlots,
    isRecording
  }) => {
  return (<div className="record-widget" >
    <Icon name='circle' onClick={onRecord} />
    <Select
      optDict={recordSlots}
      currentOpt={recordSlot}
      onChange={onChangeSlot}
    />
  </div>)
};

RecordWidget.propTypes = {
  recordSlots: PropTypes.object.required,
  recordSlot: PropTypes.string.required,
  onRecord: PropTypes.func.isRequired,
  onChangeSlot: PropTypes.func.isRequired,
  isRecording: PropTypes.bool.isRequired,
}

export default RecordWidget
