import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMaxNGenericSinkSignals } from '../signalSlice';
import IntSelect from '../../../components/IntSelect';

const GenericSignalMax = () => {
  const dispatch = useDispatch();
  const currentNum = useSelector(state => state.signal.nGenericSinkSignals);

  const handleChange = (i) => {
    dispatch(setMaxNGenericSinkSignals(i));
  };

  return (
    <IntSelect
      currentNum={currentNum}
      maxNum={21}
      onChange={handleChange}
    />
  );
};

export default GenericSignalMax;