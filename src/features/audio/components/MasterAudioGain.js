import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMasterGain, toggleMasterMute } from '../audioSlice';
import LabeledSlider from '../../../components/LabeledSlider';
import MuteButton from '../../../components/MuteButton';

const MasterAudioGain = () => {
  const dispatch = useDispatch();
  const gain = useSelector(state => state.audio.master.gain);
  const mute = useSelector(state => state.audio.master.mute);
  const level = useSelector(state => state.__volatile.audio.level);

  const handleGainChange = (val) => {
    dispatch(setMasterGain(val));
  };

  const handleMuteChange = () => {
    dispatch(toggleMasterMute(!mute));
  };

  return (
    <div className="generic-audio-widget audio-master-gain">
      <LabeledSlider
        uniqueKey="Gain-unmappedcontrolthing"
        className="unmapped-control"
        onChange={handleGainChange}
        min={-60}
        max={6}
        step={1}
        labelText="Gain"
        value={gain}
      />
      <span className="unmapped-value">
        {gain}
      </span>
      <span className="unmapped-units">
        db
      </span>
      <MuteButton mute={mute} onClick={handleMuteChange} />
    </div>
  );
};

export default MasterAudioGain;