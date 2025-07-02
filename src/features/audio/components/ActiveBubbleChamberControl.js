import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  toggleBubbleChamberVoice1Mute,
  toggleBubbleChamberVoice2Mute,
  toggleBubbleChamberVoice3Mute,
  toggleBubbleChamberBassMute,
  setBubbleChamberVoice1Sample,
  setBubbleChamberVoice2Sample,
  setBubbleChamberVoice3Sample,
} from '../audioSlice';
import BubbleChamberControl from '../../../components/BubbleChamberControl';

const ActiveBubbleChamberControl = () => {
  const dispatch = useDispatch();
  
  const voice1mute = useSelector(state => state.audio.bubbleChamber.voice1.mute);
  const voice2mute = useSelector(state => state.audio.bubbleChamber.voice2.mute);
  const voice3mute = useSelector(state => state.audio.bubbleChamber.voice3.mute);
  const bassmute = useSelector(state => state.audio.bubbleChamber.bass.mute);
  const voice1sample = useSelector(state => state.audio.bubbleChamber.voice1.sample);
  const voice2sample = useSelector(state => state.audio.bubbleChamber.voice2.sample);
  const voice3sample = useSelector(state => state.audio.bubbleChamber.voice3.sample);

  const handleChangeVoice1Mute = () => {
    dispatch(toggleBubbleChamberVoice1Mute());
  };

  const handleChangeVoice2Mute = () => {
    dispatch(toggleBubbleChamberVoice2Mute());
  };

  const handleChangeVoice3Mute = () => {
    dispatch(toggleBubbleChamberVoice3Mute());
  };

  const handleChangeBassMute = () => {
    dispatch(toggleBubbleChamberBassMute());
  };

  const handleChangeVoice1Sample = (val) => {
    dispatch(setBubbleChamberVoice1Sample(val));
  };

  const handleChangeVoice2Sample = (val) => {
    dispatch(setBubbleChamberVoice2Sample(val));
  };

  const handleChangeVoice3Sample = (val) => {
    dispatch(setBubbleChamberVoice3Sample(val));
  };

  return (
    <BubbleChamberControl
      voice1mute={voice1mute}
      voice2mute={voice2mute}
      voice3mute={voice3mute}
      bassmute={bassmute}
      voice1sample={voice1sample}
      voice2sample={voice2sample}
      voice3sample={voice3sample}
      onChangeVoice1Mute={handleChangeVoice1Mute}
      onChangeVoice2Mute={handleChangeVoice2Mute}
      onChangeVoice3Mute={handleChangeVoice3Mute}
      onChangeBassMute={handleChangeBassMute}
      onChangeVoice1Sample={handleChangeVoice1Sample}
      onChangeVoice2Sample={handleChangeVoice2Sample}
      onChangeVoice3Sample={handleChangeVoice3Sample}
    />
  );
};

export default ActiveBubbleChamberControl;