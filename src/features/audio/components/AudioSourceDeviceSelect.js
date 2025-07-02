import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAudioSourceDevice } from '../audioSlice';

const AudioSourceDeviceSelect = ({ disabled = false }) => {
  const dispatch = useDispatch();
  const deviceMap = useSelector(state => state.__volatile.audio.sources);
  const valid = useSelector(state => state.__volatile.audio.validSource);
  const currentDevice = useSelector(state => state.audio.sourceDevice);

  const handleChange = (key) => {
    dispatch(setAudioSourceDevice(key));
  };

  const optNodes = [];
  for (let [key, name] of deviceMap) {
    let nu = <option value={key} key={key}>{name}</option>;
    optNodes.push(nu);
  }

  return (
    <div className="devicechooserwidget">
      <select
        className="deviceselect"
        disabled={disabled}
        value={currentDevice}
        onChange={(ev) => handleChange(ev.target.value)}
      >
        {optNodes}
      </select>
    </div>
  );
};

export default AudioSourceDeviceSelect;