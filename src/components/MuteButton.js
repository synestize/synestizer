import React, { Component, PropTypes } from 'react'

export const MuteButton = ({mute, onClick}) => (
  <span
    className={"mute button " + String(mute)}
    onClick={onClick}>
      mute
  </span>
)
MuteButton.propTypes = {
  mute: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default MuteButton;
