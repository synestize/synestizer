import React from 'react';
import { useDispatch } from 'react-redux';
import { resetToNothing } from '../../../actions/app';
import Button from '../../../components/Button';

const NukeButton = () => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(resetToNothing());
    window.location.reload();
  };

  return (
    <Button
      text="NUKE"
      onClick={handleClick}
    />
  );
};

export default NukeButton;