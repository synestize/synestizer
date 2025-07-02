import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { load } from '../../../actions/app';
import TextBlob from '../../../components/TextBlob';

const AppStateWidget = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  // Create persistent state by removing volatile data
  const persistentState = { ...state };
  delete persistentState.__volatile;

  const handleChange = (serialized) => {
    dispatch(load(serialized));
  };

  return (
    <TextBlob
      title="DNA"
      content={JSON.stringify(persistentState)}
      className="dna"
      onChange={handleChange}
    />
  );
};

export default AppStateWidget;