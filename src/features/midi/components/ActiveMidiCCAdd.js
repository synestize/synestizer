import React from 'react';
import { useDispatch } from 'react-redux';
import Icon from '../../../components/Icon';

const ActiveMidiCCAdd = ({ adder }) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(adder());
  };

  return <Icon name="plus-circle" onClick={handleClick} />;
};

export default ActiveMidiCCAdd;