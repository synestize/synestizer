import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentVideoSource } from '../videoSlice';

const VideoSourceSelect = ({ disabled = false, withNull = true }) => {
  const dispatch = useDispatch();
  const deviceMap = useSelector(state => state.__volatile.video.sources);
  const valid = useSelector(state => state.__volatile.video.validSource);
  const currentDevice = useSelector(state => state.video.source);

  const handleChange = (key) => {
    dispatch(setCurrentVideoSource(key));
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

export default VideoSourceSelect;