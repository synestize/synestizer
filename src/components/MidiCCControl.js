import React, { Component, PropTypes, Children } from 'react';
import { union, difference, intersection } from '../lib/fakesetop'

const MidiControlControl = ({
    disabled,
    cc,
    onChange,
    onDelete,
    ccset,
    valid=true}
  ) => {
  return (<div className="ccontrontrol">
    <IntSelect
      currentNum={cc}
      unavailable={difference(ccset, [cc])}
      onChange={onChange}
      maxNum="127"
    />
  <span onClick={onDelete}>-</span>
  </div>)
}

MidiControlControl.propTypes = {
  currentNum: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  valid: PropTypes.bool,
  disabled: PropTypes.bool.isRequired,
  unavailable: PropTypes.array
}

export default MidiControlControl
