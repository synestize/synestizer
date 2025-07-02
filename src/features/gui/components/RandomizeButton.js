import React from 'react';
import { useDispatch } from 'react-redux';
import { randomize } from '../../../actions/app';
import Button from '../../../components/Button';

const RandomizeButton = () => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(randomize());
  };

  return (
    <Button
      text="randomize"
      onClick={handleClick}
    />
  );
};

export default RandomizeButton;