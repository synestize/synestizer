import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMasterTempo } from '../audioSlice';
import LabeledSlider from '../../../components/LabeledSlider';

const ActiveAudioMasterTempo = () => {
  const dispatch = useDispatch();
  const value = useSelector(state => state.audio.master.tempo);

  const handleChange = (val) => {
    dispatch(setMasterTempo(val));
  };

  return (
    <div className="generic-audio-widget">
      <LabeledSlider
        uniqueKey="Tempo-unmappedcontrolthing"
        className="unmapped-control"
        onChange={handleChange}
        min={30}
        max={600}
        step={1}
        labelText="Tempo"
        value={value}
      />
      <span className="unmapped-value">
        {value}
      </span>
      <span className="unmapped-units">
        bpm
      </span>
    </div>
  );
};

export default ActiveAudioMasterTempo;