import React from 'react';
import { useDispatch } from 'react-redux';
import { load } from '../../../actions/app';
import FileWidget from '../../../components/FileWidget';

const LoadWidget = () => {
  const dispatch = useDispatch();

  const handleChange = (f) => {
    dispatch(load(f));
  };

  return (
    <FileWidget
      text="Load"
      onChange={handleChange}
    />
  );
};

export default LoadWidget;