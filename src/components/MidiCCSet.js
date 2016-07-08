import React, { Component, PropTypes, Children } from 'react';

const MidiControlControl = ({
    disabled,
    currentNum,
    onChange,
    onDelete,
    unavailable=[],
    valid=true}
  ) => {
  const optNodes = [];
  return (<div className="ccontrontrol">
    <IntSelect
      currentNum={currentNum}
      unavailable={unavailable}
      onChange={onChange}
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
