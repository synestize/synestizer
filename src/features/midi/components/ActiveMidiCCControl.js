import React from 'react';
import { useDispatch } from 'react-redux';
import { difference } from '../../../lib/collections';
import IntSelect from '../../../components/IntSelect';
import Icon from '../../../components/Icon';

const ActiveMidiCCControl = ({ 
  cc, 
  ccset, 
  solocc, 
  adder, 
  remover, 
  solotoggler, 
  disabled 
}) => {
  const dispatch = useDispatch();
  const soloed = solocc === cc;

  const handleChange = (ev) => {
    dispatch(adder(ev));
    dispatch(remover(cc));
  };

  const handleDelete = () => {
    dispatch(remover(cc));
  };

  const handleSolo = () => {
    if (typeof solotoggler === 'function') {
      dispatch(solotoggler(cc));
    }
  };

  let soloButton;
  if (typeof solotoggler === 'function') {
    soloButton = (
      <span
        className={'solo-button' + (soloed ? ' soloed' : '')}
        onClick={handleSolo}
      >
        S
      </span>
    );
  }

  return (
    <div className="ccontrolchooser">
      <IntSelect
        currentNum={cc}
        unavailable={difference(ccset, [cc])}
        onChange={handleChange}
        maxNum={127}
      />
      {soloButton}
      <Icon name="minus-circle" onClick={handleDelete} />
    </div>
  );
};

export default ActiveMidiCCControl;