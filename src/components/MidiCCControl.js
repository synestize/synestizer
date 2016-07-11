import React, { Component, PropTypes, Children } from 'react';
import { union, difference, intersection } from '../lib/fakesetop'
import IntSelect from './IntSelect'

const MidiCCControl = ({
    disabled,
    cc,
    onChange,
    onDelete,
    ccset}
  ) => {
  return (<div className="ccontrontrol">
    <IntSelect
      currentNum={cc}
      unavailable={difference(ccset, [cc])}
      onChange={onChange}
      maxNum={127}
    />
  <span onClick={onDelete}>-</span>
  </div>)
}

MidiCCControl.propTypes = {
  currentNum: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  ccset: PropTypes.array.isRequired
}

export default MidiCCControl
