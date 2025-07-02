import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAudioSinkDevice } from '../audioSlice';

const AudioSinkDeviceSelect = ({ disabled = false }) => {
  const dispatch = useDispatch();
  const deviceMap = useSelector(state => state.__volatile.audio.sinks);
  const valid = useSelector(state => state.__volatile.audio.validSink);
  const currentDevice = useSelector(state => state.audio.sinkDevice);

  const handleChange = (key) => {
    dispatch(setAudioSinkDevice(key));
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

export default AudioSinkDeviceSelect;