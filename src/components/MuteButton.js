import React from 'react'

export const MuteButton = ({mute, onClick}) => (
  <span
    className={"mute button " + String(mute)}
    onClick={onClick}>
      mute
  </span>
)

export default MuteButton;
