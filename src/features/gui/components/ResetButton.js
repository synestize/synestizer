import React from 'react';
import { useDispatch } from 'react-redux';
import { loadFromUrl } from '../../../actions/app';
import Button from '../../../components/Button';

const ResetButton = () => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(loadFromUrl('/presets/default.json'));
  };

  return (
    <Button
      text="reset"
      onClick={handleClick}
    />
  );
};

export default ResetButton;